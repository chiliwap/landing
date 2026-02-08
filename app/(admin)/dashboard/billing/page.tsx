import {
	getUser,
	findUserBillingById,
	type Billing,
	type User,
} from "@/lib/dal";
import { Suspense } from "react";
import Link from "next/link";
import ExportAnnualSummary from "@/components/billing/export-annual-summary";

// Placeholder fetch functions (replace with real Stripe/backend integrations)
async function fetchInvoices(userId: string): Promise<
	Array<{
		id: string;
		number: string;
		amount: number;
		currency: string;
		status: string;
		createdAt: string;
		downloadUrl?: string;
	}>
> {
	// TODO: Integrate with Stripe invoices list
	return [
		{
			id: "inv_1",
			number: "000123",
			amount: 2999,
			currency: "usd",
			status: "paid",
			createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
			downloadUrl: "#",
		},
		{
			id: "inv_2",
			number: "000124",
			amount: 2999,
			currency: "usd",
			status: "paid",
			createdAt: new Date(Date.now() - 86400000 * 33).toISOString(),
			downloadUrl: "#",
		},
	];
}

const currencyFmt = (amt: number, currency: string) =>
	new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
		amt / 100
	);

export default async function BillingPage() {
	const user: User | null = await getUser();
	if (!user) {
		return <div className="p-10 text-center">Not authenticated.</div>;
	}
	const billing: Billing | null = await findUserBillingById(user.id);
	const invoices = await fetchInvoices(user.id);
	const planName = billing?.plan || "Free";
	const defaultCard = billing?.methods.find(
		(m) => m.id === billing.defaultMethodId,
	);
	const cardLabel = defaultCard
		? `${defaultCard.details.brand.toUpperCase()} •••• ${defaultCard.details.last4}`
		: "None";

	return (
		<main className="pb-20">
			<header className="border-b border-white/5 bg-gradient-to-b from-white/5/0 via-white/[0.02] to-transparent">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 lg:flex-row lg:items-end">
					<div className="flex-1 min-w-0">
						<h1 className="text-3xl font-semibold tracking-tight text-white">
							Billing
						</h1>
						<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
							View invoices, manage your subscription plan, and access
							historical receipts. Payment methods are managed within the
							Account page.
						</p>
					</div>
					<nav className="flex gap-2 flex-wrap text-[11px] font-medium">
						<Link
							href="/dashboard/account#billing"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Payment Methods
						</Link>
						<Link
							href="/dashboard/account"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Account
						</Link>
					</nav>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-14">
				{/* Current Plan */}
				<section aria-labelledby="current-plan" className="scroll-mt-24">
					<h2
						id="current-plan"
						className="text-sm font-semibold text-neutral-200 mb-4"
					>
						Current Plan
					</h2>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
						<div className="flex-1 min-w-0">
							<p className="text-lg font-medium text-white">{planName} Plan</p>
							<p className="text-xs text-neutral-400 mt-1 max-w-prose">
								Upgrade for higher usage limits, priority support, and advanced
								monitoring features. Downgrades take effect at the next billing
								cycle.
							</p>
						</div>
						<div className="flex gap-2">
							<button className="cursor-pointer inline-flex items-center rounded-md bg-white text-neutral-900 text-xs font-medium px-4 py-2 shadow-sm hover:bg-white/90 transition">
								Change Plan
							</button>
							<button className="cursor-pointer inline-flex items-center rounded-md border border-white/15 bg-white/5 text-neutral-300 text-xs font-medium px-4 py-2 hover:bg-white/10 transition">
								Usage
							</button>
						</div>
					</div>
				</section>

				{/* Invoices */}
				<section aria-labelledby="invoices" className="scroll-mt-24">
					<h2
						id="invoices"
						className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2"
					>
						Invoices{" "}
						<span className="text-[10px] font-normal text-neutral-500">
							({invoices.length})
						</span>
					</h2>
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-md">
						<table className="w-full text-left text-sm">
							<thead className="text-[11px] uppercase tracking-wide text-neutral-500 bg-white/5">
								<tr>
									<th className="py-2.5 px-4">Date</th>
									<th className="py-2.5 px-4">Invoice #</th>
									<th className="py-2.5 px-4">Amount</th>
									<th className="py-2.5 px-4">Status</th>
									<th className="py-2.5 px-4 text-right">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{invoices.map((inv) => {
									const d = new Date(inv.createdAt);
									return (
										<tr
											key={inv.id}
											className="hover:bg-white/5 transition-colors"
										>
											<td
												className="py-2.5 px-4 font-medium text-neutral-300 whitespace-nowrap"
												title={d.toLocaleString()}
											>
												{d.toLocaleDateString(undefined, {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</td>
											<td className="py-2.5 px-4 font-mono text-[12px] text-neutral-400">
												{inv.number}
											</td>
											<td className="py-2.5 px-4 text-neutral-200">
												{currencyFmt(inv.amount, inv.currency)}
											</td>
											<td className="py-2.5 px-4">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
														inv.status === "paid"
															? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
															: "bg-neutral-500/10 text-neutral-400 ring-white/10"
													}`}
												>
													{inv.status}
												</span>
											</td>
											<td className="py-2.5 px-4 text-right">
												<div className="flex justify-end gap-2">
													<a
														href={inv.downloadUrl || "#"}
														className="cursor-pointer inline-flex items-center text-[11px] font-medium text-neutral-300 hover:text-white transition"
													>
														Download
													</a>
													<button className="cursor-pointer inline-flex items-center text-[11px] font-medium text-neutral-400 hover:text-white transition">
														Receipt
													</button>
												</div>
											</td>
										</tr>
									);
								})}
								{invoices.length === 0 && (
									<tr>
										<td
											colSpan={5}
											className="py-6 px-4 text-center text-neutral-500 text-sm"
										>
											No invoices yet.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>

				{/* Documents / Statements placeholder */}
				<section aria-labelledby="documents" className="scroll-mt-24">
					<h2
						id="documents"
						className="text-sm font-semibold text-neutral-200 mb-4"
					>
						Documents
					</h2>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md p-6 text-sm text-neutral-400">
						<p className="mb-3">
							Export annual summaries or tax statements once available.
						</p>
						<ExportAnnualSummary
							planName={planName}
							invoices={invoices}
							defaultCard={cardLabel}
						/>
					</div>
				</section>

				<section aria-labelledby="notes" className="scroll-mt-24 pb-4">
					<h2 id="notes" className="sr-only">
						Help
					</h2>
					<p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
						Invoices shown here are a historical ledger of processed billing
						events. Pending or upcoming renewals appear in your subscription
						manager when a change is scheduled. For payment method updates,
						visit the Account page. Contact support for invoice disputes or
						VAT/GST adjustments.
					</p>
				</section>
			</div>
		</main>
	);
}
