import { getUser, type User } from "@/lib/auth";

// Placeholder data (would come from metrics/telemetry services or persisted aggregates)
const kpis = [
	{ label: "Controllers Online", value: 3, delta: "+1", trend: "up" },
	{ label: "Active Alerts", value: 0, delta: "0", trend: "flat" },
	{ label: "Risk Index (24h avg)", value: 62, delta: "+4", trend: "up" },
	{
		label: "Water Usage (Today)",
		value: "118 L",
		delta: "-12%",
		trend: "down",
	},
];

const recentActivity = [
	{
		id: "a1",
		ts: Date.now() - 1000 * 60 * 12,
		type: "controller.sync",
		text: "Controller Barn-West telemetry sync (temp 54°C, humidity 18%).",
	},
	{
		id: "a2",
		ts: Date.now() - 1000 * 60 * 55,
		type: "automation.soak",
		text: "Perimeter pre-soak completed (duration 4m, 38 L).",
	},
	{
		id: "a3",
		ts: Date.now() - 1000 * 60 * 130,
		type: "controller.armed",
		text: "Controller Ridge-Line armed for auto-response.",
	},
];

const upcoming = [
	{
		id: "u1",
		title: "Scheduled Pre-Soak",
		when: "Tomorrow 06:00",
		note: "Eaves + perimeter",
	},
	{
		id: "u2",
		title: "Firmware Update window",
		when: "Oct 06 02:00",
		note: "Applies to 2 controllers",
	},
];

export default async function Dashboard() {
	const user: User | null = await getUser();
	const formatTime = (ts: number) =>
		new Date(ts).toISOString().slice(11, 16) + " UTC";

	if (!user) {
		return (
			<main className="flex-1 flex items-center justify-center">
				<div className="text-center max-w-sm">
					<h1 className="text-2xl font-semibold mb-3">Access Denied</h1>
					<p className="text-sm text-neutral-400">
						You must be logged in to view the dashboard.
					</p>
				</div>
			</main>
		);
	}
	return (
		<main className="pb-24">
			<header className="border-b border-white/5">
				<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6 lg:flex-row lg:items-end">
					<div className="flex-1 min-w-0">
						<h1 className="text-3xl font-semibold tracking-tight text-white">
							Overview
						</h1>
						<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
							High‑level status of your wildfire protection footprint:
							controller health, risk trends, automation activity, and resource
							usage. Data below is illustrative.
						</p>
					</div>
					<div className="flex gap-2 flex-wrap text-[11px] font-medium">
						<a
							href="/dashboard/manage"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Controllers
						</a>
						<a
							href="/dashboard/billing"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Billing
						</a>
						<a
							href="/dashboard/account"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Account
						</a>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 mt-10 space-y-12">
				{/* KPI Row */}
				<section aria-labelledby="kpi" className="scroll-mt-24">
					<h2 id="kpi" className="sr-only">
						Key metrics
					</h2>
					<ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{kpis.map((k) => {
							const trendColor =
								k.trend === "up"
									? "text-emerald-400"
									: k.trend === "down"
									? "text-rose-400"
									: "text-neutral-400";
							return (
								<li
									key={k.label}
									className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1"
								>
									<span className="uppercase tracking-wide text-[10px] text-neutral-500">
										{k.label}
									</span>
									<div className="flex items-baseline gap-2">
										<span className="text-xl font-semibold text-white">
											{k.value}
										</span>
										<span className={`text-[11px] font-medium ${trendColor}`}>
											{k.delta}
										</span>
									</div>
								</li>
							);
						})}
					</ul>
				</section>

				{/* Risk & Usage Charts placeholder */}
				<section aria-labelledby="charts" className="grid gap-6 md:grid-cols-3">
					<div className="md:col-span-2 rounded-2xl border border-white/10 bg-neutral-900/40 p-5 relative overflow-hidden">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
							Risk Trend (demo)
							<span className="text-[10px] font-normal text-neutral-500">
								24h
							</span>
						</h2>
						<div className="h-52 grid place-items-center text-neutral-500 text-xs tracking-wide">
							<span className="opacity-70">
								Chart placeholder – integrate sparkline/time-series
							</span>
						</div>
						<div className="mt-4 flex gap-4 text-[11px] text-neutral-400">
							<div>
								<span className="block text-neutral-300 font-medium">Peak</span>{" "}
								71
							</div>
							<div>
								<span className="block text-neutral-300 font-medium">Low</span>{" "}
								54
							</div>
							<div>
								<span className="block text-neutral-300 font-medium">
									Δ 24h
								</span>{" "}
								+9
							</div>
						</div>
					</div>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4">
							Water Usage (demo)
						</h2>
						<div className="h-52 flex-1 grid place-items-center text-neutral-500 text-xs">
							Placeholder radial / bar chart
						</div>
						<ul className="mt-4 space-y-2 text-[11px]">
							<li className="flex justify-between">
								<span className="text-neutral-400">Today</span>
								<span className="text-neutral-200">118 L</span>
							</li>
							<li className="flex justify-between">
								<span className="text-neutral-400">7‑day avg</span>
								<span className="text-neutral-200">132 L</span>
							</li>
							<li className="flex justify-between">
								<span className="text-neutral-400">Projection</span>
								<span className="text-neutral-200">↓ 8%</span>
							</li>
						</ul>
					</div>
				</section>

				{/* Activity & Alerts */}
				<section
					aria-labelledby="activity"
					className="grid gap-6 md:grid-cols-3"
				>
					<div className="md:col-span-2 rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4">
							Recent Activity
						</h2>
						<ol className="space-y-4">
							{recentActivity.map((ev) => (
								<li key={ev.id} className="flex gap-3">
									<span className="mt-1.5 h-2 w-2 rounded-full bg-white/40" />
									<div className="flex-1 min-w-0">
										<p className="text-[13px] text-neutral-300 leading-snug">
											{ev.text}
										</p>
										<p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-1">
											{formatTime(ev.ts)}
										</p>
									</div>
								</li>
							))}
						</ol>
						<div className="mt-6 pt-4 border-t border-white/5">
							<a
								href="/dashboard/activity"
								className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200"
							>
								View full activity →
							</a>
						</div>
					</div>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
							Alerts{" "}
							<span className="text-[10px] font-normal text-neutral-500">
								(0 active)
							</span>
						</h2>
						<p className="text-xs text-neutral-500 leading-relaxed">
							No active alerts. Controllers are monitoring humidity &
							temperature thresholds. You will see real‑time triggers here when
							risk states escalate.
						</p>
						<div className="mt-6">
							<a
								href="/dashboard/alerts"
								className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200"
							>
								Configure thresholds →
							</a>
						</div>
						<div className="mt-8 text-[10px] text-neutral-600 border-t border-white/5 pt-4 leading-relaxed">
							Demo data only; connect backend metrics service to populate
							dynamic risk scoring and automated response logs.
						</div>
					</div>
				</section>

				{/* Upcoming / Scheduled */}
				<section aria-labelledby="upcoming" className="scroll-mt-24">
					<h2
						id="upcoming"
						className="text-sm font-semibold text-neutral-200 mb-4"
					>
						Upcoming
					</h2>
					<ul className="grid md:grid-cols-2 gap-4">
						{upcoming.map((u) => (
							<li
								key={u.id}
								className="rounded-xl border border-white/10 bg-neutral-900/40 p-4"
							>
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="text-sm font-medium text-white">{u.title}</p>
										<p className="text-[11px] text-neutral-500 mt-1">
											{u.note}
										</p>
									</div>
									<span className="text-[11px] px-2 py-1 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-neutral-300 whitespace-nowrap">
										{u.when}
									</span>
								</div>
							</li>
						))}
					</ul>
				</section>

				<section aria-labelledby="notes" className="pb-4">
					<h2 id="notes" className="sr-only">
						Help
					</h2>
					<p className="text-[11px] text-neutral-500 leading-relaxed max-w-3xl">
						This overview synthesizes controller telemetry, automation outcomes,
						and usage metrics. In production you would query consolidated
						aggregates (e.g. DynamoDB + analytics pipeline) and stream deltas
						over WebSockets for live updates.
					</p>
				</section>
			</div>
		</main>
	);
}
