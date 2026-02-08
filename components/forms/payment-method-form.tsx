"use client";

import { useActionState, useEffect, useMemo, useState, useRef } from "react";
import { cardBrands } from "@/components/billing/card-brands";
import type { PaymentMethodFormState } from "./actions/method";
import type { Card } from "@/lib/dal";
import { CompactSelect } from "../ui/dropdown";

export default function PaymentMethodForm({
	action,
	setAddedMethod,
	setOpenState,
}: {
	action: (formData: FormData) => Promise<PaymentMethodFormState>;
	setAddedMethod: (method: Card) => void;
	setOpenState: (open: boolean) => void;
}) {
	const [submitting, setSubmitting] = useState(false);
	const [methodType, setMethodType] = useState<"card" | "other">("card");
	const [cardNumber, setCardNumber] = useState("");
	const [otherBrand, setOtherBrand] = useState("paypal");
	const expMonthRef = useRef<HTMLInputElement | null>(null);
	const expYearRef = useRef<HTMLInputElement | null>(null);
	const cardNumberRef = useRef<HTMLInputElement | null>(null);
	const cvvRef = useRef<HTMLInputElement | null>(null);
	const [state, formAction] = useActionState<PaymentMethodFormState, FormData>(
		async (_prev, formData) => {
			setSubmitting(true);
			const result = await action(formData);
			setSubmitting(false);
			return result;
		},
		{ ok: false }
	);

	useEffect(() => {
		if (state.ok && !state.error && state.method) {
			// Assuming the action returns the new card details
			setAddedMethod(state.method);

			setOpenState(false);
		}
	}, [state]);

	function detectBrand(num: string): keyof typeof cardBrands | "generic" {
		const digits = num.replace(/\D/g, "");
		if (/^4\d{0,}$/.test(digits)) return "visa";
		if (/^(5[1-5]|2[2-7])\d{0,}$/.test(digits)) return "mastercard";
		if (/^3[47]\d{0,}$/.test(digits)) return "amex";
		return "generic";
	}

	// Format card number as groups of 4 while keeping only digits for brand detection
	function formatCardNumber(input: string): string {
		return input
			.replace(/[^0-9]/g, "")
			.slice(0, 19)
			.replace(/(\d{4})(?=\d)/g, "$1 ");
	}

	const detectedBrand = useMemo(() => detectBrand(cardNumber), [cardNumber]);

	// should populate the db with a new payment method
	return (
		<div className="w-full max-w-2xl mx-auto text-white">
			<form
				action={formAction}
				className="space-y-4"
				onSubmit={() => setSubmitting(true)}
			>
				{/* SECURITY NOTE: Full card number & CVV are submitted only to derive last4 & validate, then discarded server-side. */}
				{/* Honeypot field to deter bots */}
				<input
					type="text"
					name="company"
					tabIndex={-1}
					autoComplete="off"
					className="hidden"
					aria-hidden="true"
				/>
				{/* Hidden method type for server */}
				<input type="hidden" name="methodType" value={methodType} />
				{/* Cardholder & Address */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label htmlFor="name" className="block text-sm text-neutral-400">
							Cardholder Name
						</label>
						<input
							id="name"
							name="name"
							required
							placeholder="Jane Q. Public"
							autoComplete="cc-name"
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
					<div>
						<label htmlFor="address" className="block text-sm text-neutral-400">
							Billing Address
						</label>
						<input
							id="address"
							name="address"
							required
							placeholder="123 Main St, City, Country"
							autoComplete="street-address"
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
				</div>

				{/* Method type chip tabs */}
				<div className="inline-flex gap-2">
					<button
						type="button"
						onClick={() => setMethodType("card")}
						className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide border transition-colors ${
							methodType === "card"
								? "bg-blue-600/90 text-white border-blue-500 shadow-sm"
								: "bg-black/20 text-neutral-200 border-neutral-700 hover:bg-black/30"
						}`}
						aria-pressed={methodType === "card"}
					>
						<span className="inline-block [&_svg]:w-4 [&_svg]:h-4">
							{cardBrands.generic}
						</span>
						<span>Card</span>
					</button>
					<button
						type="button"
						onClick={() => setMethodType("other")}
						className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide border transition-colors ${
							methodType === "other"
								? "bg-blue-600/90 text-white border-blue-500 shadow-sm"
								: "bg-black/20 text-neutral-200 border-neutral-700 hover:bg-black/30"
						}`}
						aria-pressed={methodType === "other"}
					>
						<span className="inline-block [&_svg]:w-4 [&_svg]:h-4">
							{cardBrands.paypal}
						</span>
						<span>Other</span>
					</button>
				</div>

				{/* Brand & Number (card) OR Other method selector */}
				{methodType === "card" ? (
					<div className="grid grid-cols-1 gap-4">
						{/* Derived brand for server */}
						<input type="hidden" name="brand" value={detectedBrand} />
						<div className="flex flex-row space-x-3">
							<div className="w-2/3">
								<label
									htmlFor="cardNumber"
									className="block text-sm text-neutral-400"
								>
									Card Number
								</label>
								<div className="relative mt-1 flex flex-row items-center">
									<div className="absolute self-center left-2 pointer-events-none [&_svg]:w-6 [&_svg]:h-6">
										{cardBrands[detectedBrand] ?? cardBrands.generic}
									</div>
									<input
										ref={cardNumberRef}
										id="cardNumber"
										name="cardNumber"
										inputMode="numeric"
										autoComplete="cc-number"
										pattern="[0-9\s-]{12,23}"
										title="Enter a valid card number"
										required={methodType === "card"}
										placeholder="4242 4242 4242 4242"
										value={formatCardNumber(cardNumber)}
										onChange={(e) => {
											const raw = e.target.value;
											setCardNumber(raw);
											const digits = raw.replace(/\D/g, "");
											const needed = detectedBrand === "amex" ? 15 : 16;
											if (digits.length >= needed && cvvRef.current) {
												cvvRef.current.focus();
											}
										}}
										onPaste={(e) => {
											const text = e.clipboardData.getData("text");
											if (text) {
												e.preventDefault();
												const formatted = formatCardNumber(text);
												setCardNumber(formatted);
												const digits = formatted.replace(/\D/g, "");
												const needed = detectedBrand === "amex" ? 15 : 16;
												if (digits.length >= needed && cvvRef.current) {
													cvvRef.current.focus();
												}
											}
										}}
										className="pl-10 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600 caret-white tracking-wider"
									/>
								</div>
							</div>
							{/* CVV */}
							<div className="w-1/3">
								<label htmlFor="cvv" className="block text-sm text-neutral-400">
									CVV
								</label>
								<div className="relative mt-1 flex flex-row items-center">
									<div className="absolute self-center left-2 pointer-events-none [&_svg]:w-6 [&_svg]:h-6">
										{/* CVV Icon */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											viewBox="0 0 32 32"
										>
											<g>
												<rect
													x="2"
													y="7"
													width="28"
													height="18"
													rx="3"
													ry="3"
													fill="#e6e6e6"
													strokeWidth="0"
												></rect>
												<path
													fill="#fff"
													strokeWidth="0"
													d="M6 18H19V21H6z"
												></path>
												<path
													d="m24.5,13.5c1.519,0,2.902.569,3.96,1.5h1.54v-4H2v4h18.541c1.057-.931,2.44-1.5,3.959-1.5Z"
													fill="#1a1a1a"
													strokeWidth="0"
												></path>
												<path
													d="m27,7H5c-1.657,0-3,1.343-3,3v12c0,1.657,1.343,3,3,3h22c1.657,0,3-1.343,3-3v-12c0-1.657-1.343-3-3-3Zm2,15c0,1.103-.897,2-2,2H5c-1.103,0-2-.897-2-2v-12c0-1.103.897-2,2-2h22c1.103,0,2,.897,2,2v12Z"
													strokeWidth="0"
													opacity=".15"
												></path>
												<path
													d="m27,8H5c-1.105,0-2,.895-2,2v1c0-1.105.895-2,2-2h22c1.105,0,2,.895,2,2v-1c0-1.105-.895-2-2-2Z"
													fill="#fff"
													opacity=".2"
													strokeWidth="0"
												></path>
												<circle
													cx="24.5"
													cy="19.5"
													r="6"
													fill="#e6e6e6"
													strokeWidth="0"
												></circle>
												<path
													fill="#fff"
													strokeWidth="0"
													d="M19 17H29V22H19z"
												></path>
												<circle
													cx="24.5"
													cy="19.5"
													r="6"
													fill="none"
													stroke="#ed1c24"
													strokeMiterlimit="10"
												></circle>
												<circle
													cx="21.75"
													cy="19.5"
													r=".75"
													fill="#1a1a1a"
													strokeWidth="0"
												></circle>
												<circle
													cx="24.25"
													cy="19.5"
													r=".75"
													fill="#1a1a1a"
													strokeWidth="0"
												></circle>
												<circle
													cx="26.75"
													cy="19.5"
													r=".75"
													fill="#1a1a1a"
													strokeWidth="0"
												></circle>
											</g>
										</svg>
									</div>
									<input
										ref={cvvRef}
										id="cvv"
										name="cvv"
										type="password"
										inputMode="numeric"
										autoComplete="cc-csc"
										pattern="\d{3,4}"
										title="Enter a valid CVV"
										required={methodType === "card"}
										placeholder="123"
										onInput={(e) => {
											const t = e.currentTarget;
											const maxLen = detectedBrand === "amex" ? 4 : 3;
											t.value = t.value.replace(/[^0-9]/g, "").slice(0, maxLen);
											if (t.value.length === maxLen && expMonthRef.current) {
												expMonthRef.current.focus();
											}
										}}
										className="pl-10 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600 tracking-wider"
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="exp_month"
									className="block text-sm text-neutral-400"
								>
									Exp. Month
								</label>
								<input
									ref={expMonthRef}
									id="exp_month"
									name="exp_month"
									inputMode="numeric"
									pattern="^(0[1-9]|1[0-2])$"
									maxLength={2}
									autoComplete="cc-exp-month"
									required={methodType === "card"}
									placeholder="MM"
									onInput={(e) => {
										const t = e.currentTarget;
										t.value = t.value.replace(/[^0-9]/g, "").slice(0, 2);
										if (t.value.length === 2 && expYearRef.current) {
											expYearRef.current.focus();
										}
									}}
									className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600 tracking-wider"
								/>
							</div>
							<div>
								<label
									htmlFor="exp_year"
									className="block text-sm text-neutral-400"
								>
									Exp. Year
								</label>
								<input
									ref={expYearRef}
									id="exp_year"
									name="exp_year"
									inputMode="numeric"
									pattern="^[0-9]{2}$"
									maxLength={2}
									autoComplete="cc-exp-year"
									required={methodType === "card"}
									placeholder="YY"
									onInput={(e) => {
										const t = e.currentTarget;
										t.value = t.value.replace(/[^0-9]/g, "").slice(0, 2);
									}}
									className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600 tracking-wider"
								/>
							</div>
						</div>
					</div>
				) : (
					<div>
						<label
							htmlFor="otherBrand"
							className="block text-sm text-neutral-400"
						>
							Other method
						</label>
						{/* Custom dropdown */}
						<CompactSelect
							id="otherBrand"
							icon={cardBrands}
							value={otherBrand}
							onChange={setOtherBrand}
							options={[
								{ value: "paypal", label: "PayPal" },
								{ value: "apple", label: "Apple Pay" },
								{ value: "google", label: "Google Pay" },
							]}
							className="mt-1"
							placeholder="Select a method"
							ariaLabel="Select payment method"
						/>
						{/* Provide brand for server as hidden input */}
						<input type="hidden" name="brand" value={otherBrand} />
						{/* Connect action */}
						<div className="mt-3">
							<button
								type="button"
								onClick={() => {
									if (typeof window !== "undefined") {
										window.location.href = `/api/billing/connect?provider=${otherBrand}`;
									}
								}}
								className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 duration-200 transition-colors"
							>
								<span className="inline-block [&_svg]:w-4 [&_svg]:h-4">
									{cardBrands[otherBrand as keyof typeof cardBrands] ??
										cardBrands.generic}
								</span>
								<span>
									Connect{" "}
									{otherBrand.charAt(0).toUpperCase() + otherBrand.slice(1)}
								</span>
							</button>
						</div>
					</div>
				)}
				<div className="flex items-center gap-3">
					<button
						type="submit"
						className={`${
							submitting
								? "cursor-not-allowed bg-white/90"
								: "cursor-pointer bg-white hover:bg-white/90"
						} inline-flex items-center justify-center rounded-lg text-black px-4 py-2 mt-3 text-sm font-medium  transition-colors`}
						disabled={submitting}
					>
						{submitting ? (
							<span className="flex items-center gap-2">
								<svg
									className="mr-3 -ml-1 size-5 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Adding...
							</span>
						) : (
							"Add Payment Method"
						)}
					</button>
					{!state.ok && state.error && (
						<p className="text-xs text-red-400">{state.error}</p>
					)}
					{/* wont be seen */}
					{/* {state.ok && (
						<p className="text-xs text-green-400">Card added successfully.</p>
					)} */}
				</div>
			</form>
		</div>
	);
}
