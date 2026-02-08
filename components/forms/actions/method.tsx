"use server";

import { BILLING_TABLE, dynamodb } from "@/lib/dynamodb";
import { PutCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import type { CardBrand } from "@/components/billing/card-brands";
import { getUser, type Billing, type Card } from "@/lib/dal";
import { stripe, getOrCreateCustomer } from "@/lib/stripe";

export type PaymentMethodFormState = {
	ok: boolean;
	method?: Card;
	error?: string;
};

function sanitizeDigits(input: string): string {
	return input.replace(/[^0-9]/g, "");
}

/**
 * Add a payment method (card or external wallet reference) to the user's Billing record.
 *
 * SECURITY / PCI NOTE:
 *  - We NEVER persist full Primary Account Number (PAN) nor CVV to our database.
 *  - PAN & CVV are only read from the form to derive last4 and perform basic validation, then discarded.
 *  - Real deployments should use a PCI-compliant processor (e.g. Stripe, Adyen) to tokenize card data in the browser
 *    and send only a token (plus last4/brand/exp) to the server. This demo intentionally avoids storing sensitive data.
 */
export async function submitMethodChange(
	formData: FormData,
): Promise<PaymentMethodFormState> {
	try {
		const honeypot = (formData.get("company") || "").toString().trim();
		if (honeypot) return { ok: true };

		const user = await getUser();
		if (!user) return { ok: false, error: "You must be signed in." };

		const methodType = (formData.get("methodType") || "card").toString();
		const name = (formData.get("name") || "").toString().trim();
		const address = (formData.get("address") || "").toString().trim();
		const brand = (formData.get("brand") || "").toString().trim() as CardBrand;
		if (!name || !address || !brand) {
			return { ok: false, error: "Please complete all required fields." };
		}

		const now = new Date().toISOString();
		const cardId = `card_${Date.now()}_${Math.random()
			.toString(36)
			.slice(2, 8)}`;

		// We'll construct a Card object WITHOUT full card number or CVV
		let card: Card;
		let pmId: string | undefined;
		if (methodType === "card") {
			const cardNumberRaw = (formData.get("cardNumber") || "").toString();
			const cvv = (formData.get("cvv") || "").toString();
			const expMonthRaw = (formData.get("exp_month") || "").toString();
			const expYearRaw = (formData.get("exp_year") || "").toString();
			if (!cardNumberRaw || !expMonthRaw || !expYearRaw) {
				return { ok: false, error: "Please complete all required fields." };
			}
			const cardNumber = sanitizeDigits(cardNumberRaw);
			if (cardNumber.length < 12 || cardNumber.length > 19) {
				return { ok: false, error: "Enter a valid card number." };
			}
			const last4 = cardNumber.slice(-4);
			const exp_month = Number(expMonthRaw);
			let exp_year = Number(expYearRaw);
			// Accept 2-digit year (YY) and convert to 20YY (basic approach; adjust if supporting past century)
			if (expYearRaw.length === 2) {
				const currentYear = new Date().getFullYear();
				const century = Math.floor(currentYear / 100) * 100; // e.g. 2000
				exp_year = century + exp_year;
			}
			if (
				!Number.isInteger(exp_month) ||
				exp_month < 1 ||
				exp_month > 12 ||
				!Number.isInteger(exp_year) ||
				exp_year < new Date().getFullYear() ||
				exp_year > new Date().getFullYear() + 20
			) {
				return { ok: false, error: "Enter a valid expiration date." };
			}
			// DO NOT store full card number or CVV. Discard them after deriving last4 / validation.
			// In production, replace this with a token from a payment processor.

			// Early duplicate check BEFORE creating Stripe resources
			const existingForDup = await dynamodb.send(
				new GetCommand({ TableName: BILLING_TABLE, Key: { id: user.id } }),
			);
			if (existingForDup.Item) {
				const billingItem = existingForDup.Item as Billing;
				const signature = (b: string, l4: string, m: number, y: number) =>
					[b.toLowerCase(), l4, m, y].join(":");
				const newSig = signature(brand, last4, exp_month, exp_year);
				const dup = billingItem.methods.some(
					(m) =>
						signature(
							m.details.brand,
							m.details.last4,
							m.details.exp_month,
							m.details.exp_year,
						) === newSig,
				);
				if (dup) {
					return { ok: false, error: "This card is already added." };
				}
			}

			// Ensure we have a Stripe customer for this user (after confirming not duplicate)
			const customerId = await getOrCreateCustomer({
				id: user.id,
				email: user.email,
				name: user.name,
			});

			// Create a Stripe PaymentMethod using raw details (for demo; in production use Elements / tokenization)
			try {
				// Map test card numbers to Stripe test tokens to avoid raw PAN API usage
				function mapTestToken(num: string): string | null {
					const n = num.replace(/\s+/g, "");
					const last4 = n.slice(-4);
					// Basic patterns (Stripe examples)
					if (/^4242424242424242$/.test(n)) return "tok_visa";
					if (/^4000002500003155$/.test(n)) return "tok_visa_debit";
					if (/^5555555555554444$/.test(n)) return "tok_mastercard";
					if (/^2223003122003222$/.test(n)) return "tok_mastercard"; // 2-series MC
					if (/^378282246310005$/.test(n)) return "tok_amex";
					if (/^6011111111111117$/.test(n)) return "tok_discover";
					if (/^30569309025904$/.test(n)) return "tok_diners";
					if (/^3530111333300000$/.test(n)) return "tok_jcb";
					// fallback by brand heuristic if allowed; else null
					switch (brand) {
						case "visa":
							return "tok_visa";
						case "mastercard":
							return "tok_mastercard";
						case "amex":
							return "tok_amex";
						default:
							return null;
					}
				}

				const token = mapTestToken(cardNumber);
				if (!token) {
					return {
						ok: false,
						error:
							"Unsupported test card. Use a documented Stripe test card like 4242 4242 4242 4242.",
					};
				}

				// Create PM from token
				const pm = await stripe.paymentMethods.create({
					type: "card",
					card: { token },
					billing_details: { name, address: { line1: address } },
				});
				pmId = pm.id;
				await stripe.paymentMethods.attach(pm.id, { customer: customerId });
				const existing = await stripe.customers.retrieve(customerId);
				if (
					!existing ||
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(existing as any).invoice_settings?.default_payment_method == null
				) {
					await stripe.customers.update(customerId, {
						invoice_settings: { default_payment_method: pm.id },
					});
				}
			} catch (stripeErr) {
				console.error("Stripe payment method creation failed", stripeErr);
				return {
					ok: false,
					error: "Failed to create Stripe test payment method.",
				};
			}

			card = {
				id: cardId,
				createdAt: now,
				pmId,
				details: { name, address, brand, last4, exp_month, exp_year },
			};
			// Explicitly overwrite local variables holding sensitive data (best-effort). Not strictly necessary in JS runtime.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _discard = () => {
				for (const v of [cardNumber, cvv]) {
					/* noop - aid GC */
				}
			};
		} else {
			card = {
				id: cardId,
				createdAt: now,
				details: {
					name,
					address,
					brand,
					last4: "—",
					exp_month: 0,
					exp_year: 0,
				},
			};
		}

		// check if exact card already exists for user
		// note: there can be multiple cards associated to one person

		// update database modelled on the Billing interface in lib/auth.ts

		const existing = await dynamodb.send(
			new GetCommand({ TableName: BILLING_TABLE, Key: { id: user.id } }),
		);

		// (Duplicate already checked earlier for card methods before Stripe API calls.)

		// if no existing billing record, create one
		// if existing record, append to methods array
		// if no defaultMethodId, set this card as default
		// do not change defaultMethodId if already set
		// always update updatedAt timestamp
		if (!existing.Item) {
			const billing: Billing = {
				id: user.id,
				customerId: pmId
					? await getOrCreateCustomer({
							id: user.id,
							email: user.email,
							name: user.name,
						})
					: "",
				paymentId: pmId || "",
				methods: [card],
				defaultMethodId: cardId,
				updatedAt: now,
			};
			await dynamodb.send(
				new PutCommand({ TableName: BILLING_TABLE, Item: billing }),
			);
		} else {
			// append card & update customerId/paymentId if newly added with Stripe
			await dynamodb.send(
				new UpdateCommand({
					TableName: BILLING_TABLE,
					Key: { id: user.id },
					UpdateExpression:
						"SET #methods = list_append(if_not_exists(#methods, :empty), :card), #updatedAt = :now" +
						(pmId ? ", #paymentId = :paymentId" : ""),
					ExpressionAttributeNames: {
						"#methods": "methods",
						"#updatedAt": "updatedAt",
						...(pmId ? { "#paymentId": "paymentId" } : {}),
					},
					ExpressionAttributeValues: {
						":card": [card],
						":empty": [],
						":now": now,
						...(pmId ? { ":paymentId": pmId } : {}),
					},
				}),
			);
			const item = existing.Item as Billing;
			if (!item.defaultMethodId) {
				await dynamodb.send(
					new UpdateCommand({
						TableName: BILLING_TABLE,
						Key: { id: user.id },
						UpdateExpression: "SET #default = :id, #updatedAt = :now",
						ExpressionAttributeNames: {
							"#default": "defaultMethodId",
							"#updatedAt": "updatedAt",
						},
						ExpressionAttributeValues: { ":id": cardId, ":now": now },
					}),
				);
			}
		}

		return { ok: true, method: card };
	} catch (e) {
		console.error("submitMethodChange error", e);
		return { ok: false, error: "Failed to add card. Please try again." };
	}
}

export async function deleteBillingMethod(methodId: string): Promise<{
	ok: boolean;
	error?: string;
	deletedId?: string;
}> {
	try {
		const user = await getUser();
		if (!user) return { ok: false, error: "You must be signed in." };
		if (!methodId) return { ok: false, error: "Missing method id." };

		const existing = await dynamodb.send(
			new GetCommand({ TableName: BILLING_TABLE, Key: { id: user.id } }),
		);
		if (!existing.Item) return { ok: false, error: "No billing record." };
		const billing = existing.Item as Billing;
		const methods = billing.methods || [];
		const target = methods.find((m) => m.id === methodId);
		const filtered = methods.filter((m) => m.id !== methodId);
		if (!target) {
			return { ok: false, error: "Method not found." };
		}

		// Detach from Stripe if we have a pmId
		if (target.pmId) {
			try {
				await stripe.paymentMethods.detach(target.pmId);
			} catch (err) {
				console.error("Failed to detach Stripe payment method", err);
			}
		}
		const now = new Date().toISOString();
		let newDefault = billing.defaultMethodId;
		if (billing.defaultMethodId === methodId) {
			newDefault = filtered.length ? filtered[0].id : "";
		}
		await dynamodb.send(
			new UpdateCommand({
				TableName: BILLING_TABLE,
				Key: { id: user.id },
				UpdateExpression:
					"SET #methods = :methods, #default = :default, #updatedAt = :now",
				ExpressionAttributeNames: {
					"#methods": "methods",
					"#default": "defaultMethodId",
					"#updatedAt": "updatedAt",
				},
				ExpressionAttributeValues: {
					":methods": filtered,
					":default": newDefault,
					":now": now,
				},
			}),
		);

		// If we removed the default Stripe payment method, attempt to set a new one
		try {
			if (billing.customerId && target.pmId && newDefault) {
				const newDefaultCard = filtered.find((m) => m.id === newDefault);
				if (newDefaultCard?.pmId) {
					await stripe.customers.update(billing.customerId, {
						invoice_settings: { default_payment_method: newDefaultCard.pmId },
					});
				}
			}
		} catch (e) {
			console.error("Failed to update Stripe customer default pm", e);
		}
		return { ok: true, deletedId: methodId };
	} catch (e) {
		console.error("deleteBillingMethod error", e);
		return { ok: false, error: "Failed to remove method." };
	}
}
