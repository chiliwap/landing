import { getUser, type User } from "@/lib/dal";

// Placeholder portfolio/balances style data - adapt to domain (e.g., water capacity, controller battery, credit balance)
const balanceData = [
	{
		label: "Water Reserve Capacity",
		value: 84,
		unit: "%",
		detail: "Primary cistern",
	},
	{
		label: "Battery Backup",
		value: 67,
		unit: "%",
		detail: "UPS + Solar buffer",
	},
	{
		label: "Monthly Usage Credit",
		value: 42,
		unit: "%",
		detail: "Plan allowance",
	},
	{
		label: "Automations This Month",
		value: 19,
		unit: " runs",
		detail: "Protective routines",
	},
];

export default async function BalancesPage() {
	const user: User | null = await getUser();
	if (!user) {
		return (
			<div className="p-10 text-center text-sm text-neutral-400">
				Not authenticated.
			</div>
		);
	}
	return (
		<main className="pb-24">
			<header className="border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 py-10">
					<h1 className="text-3xl font-semibold tracking-tight text-white">
						Balances
					</h1>
					<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
						Resource & allowance style values representing remaining capacity
						and protective automation headroom. Replace these with real
						telemetry + billing usage counters.
					</p>
				</div>
			</header>
			<div className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
				<section aria-labelledby="balance-cards" className="scroll-mt-24">
					<h2 id="balance-cards" className="sr-only">
						Balance Cards
					</h2>
					<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{balanceData.map((b) => (
							<li
								key={b.label}
								className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col gap-4"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-medium text-white">{b.label}</p>
										<p className="text-[11px] text-neutral-500 mt-1">
											{b.detail}
										</p>
									</div>
									<span className="text-lg font-semibold text-white">
										{b.value}
										{b.unit}
									</span>
								</div>
								<div className="h-2 rounded bg-white/5 overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-white/50 to-white/30"
										style={{ width: `${Math.min(100, b.value)}%` }}
									/>
								</div>
							</li>
						))}
					</ul>
				</section>

				<section aria-labelledby="explanation" className="pb-4">
					<h2 id="explanation" className="sr-only">
						Explanation
					</h2>
					<p className="text-[11px] text-neutral-500 leading-relaxed max-w-3xl">
						Balances summarize consumable or threshold‑based capacities. For
						production tie these to plan limits (e.g., monthly automation
						count), infrastructure metrics (water levels), and resilience
						indicators (battery reserve). Consider streaming updates when values
						change materially.
					</p>
				</section>
			</div>
		</main>
	);
}
