import Link from "next/link";

import RiskSparkline from "@/components/charts/risk-sparkline";
import WaterUsageGauge from "@/components/charts/water-usage-gauge";
import ExportReport from "@/components/dashboard/export-report";
import WeatherHeader from "@/components/dashboard/weather-card";
import { getUser, type User } from "@/lib/dal";
import {
	getDashboardAlertConfig,
	getDashboardOverview,
	listDashboardActivity,
} from "@/lib/dashboard";

function extractLeadingNumber(input: string | undefined): number | null {
	if (!input) return null;
	const match = input.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
	if (!match) return null;
	const value = Number(match[0]);
	return Number.isFinite(value) ? value : null;
}

function computeWaterRatio(today: string, average: string): number | null {
	const todayValue = extractLeadingNumber(today);
	const avgValue = extractLeadingNumber(average);

	if (todayValue === null || avgValue === null || avgValue <= 0) {
		return null;
	}

	return todayValue / avgValue;
}

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

	const [overview, activityFeed, alertsConfig] = await Promise.all([
		getDashboardOverview(user.id),
		listDashboardActivity(user.id, { limit: 5 }),
		getDashboardAlertConfig(user.id),
	]);

	const riskStats = overview.riskTrend.stats;
	const riskDeltaDisplay =
		riskStats.delta > 0 ? `+${riskStats.delta}` : `${riskStats.delta}`;

	const activityColor = (category: string) => {
		switch (category) {
			case "automation":
				return "bg-emerald-400/80";
			case "alert":
				return "bg-rose-400/80";
			case "controller":
				return "bg-sky-400/80";
			case "user":
				return "bg-neutral-300/70";
			default:
				return "bg-white/40";
		}
	};
	const riskSeries = overview.riskTrend.series ?? [];
	const waterRatio = computeWaterRatio(
		overview.waterUsage.today,
		overview.waterUsage.sevenDayAvg,
	);

	return (
		<main className="pb-24">
			<WeatherHeader>
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
						<ExportReport overview={overview} activityFeed={activityFeed} />
						<Link
							href="/dashboard/manage"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Controllers
						</Link>
						<Link
							href="/dashboard/billing"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Billing
						</Link>
						<Link
							href="/dashboard/account"
							className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
						>
							Account
						</Link>
					</div>
				</div>
			</WeatherHeader>

			<div className="max-w-7xl mx-auto px-6 mt-10 space-y-12">
				{/* KPI Row */}
				<section aria-labelledby="kpi" className="scroll-mt-24">
					<h2 id="kpi" className="sr-only">
						Key metrics
					</h2>
					<ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{overview.kpis.map((kpi) => {
							const trendColor =
								kpi.trend === "up"
									? "text-emerald-400"
									: kpi.trend === "down"
										? "text-rose-400"
										: "text-neutral-400";
							return (
								<li
									key={kpi.id}
									className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1"
								>
									<span className="uppercase tracking-wide text-[10px] text-neutral-500">
										{kpi.label}
									</span>
									<div className="flex items-baseline gap-2">
										<span className="text-xl font-semibold text-white">
											{kpi.value}
										</span>
										<span className={`text-[11px] font-medium ${trendColor}`}>
											{kpi.delta}
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
							Risk Trend
							<span className="text-[10px] font-normal text-neutral-500">
								{overview.riskTrend.timeframe}
							</span>
						</h2>
						<div className="h-52">
							<RiskSparkline
								series={riskSeries}
								narrative={overview.riskTrend.narrative}
								className="h-full w-full"
							/>
						</div>
						<div className="mt-4 flex gap-4 text-[11px] text-neutral-400">
							<div>
								<span className="block text-neutral-300 font-medium">Peak</span>{" "}
								{riskStats.peak}
							</div>
							<div>
								<span className="block text-neutral-300 font-medium">Low</span>{" "}
								{riskStats.low}
							</div>
							<div>
								<span className="block text-neutral-300 font-medium">
									Δ {overview.riskTrend.timeframe}
								</span>{" "}
								{riskDeltaDisplay}
							</div>
						</div>
					</div>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4">
							Water Usage
						</h2>
						<div className="h-52 flex-1 flex items-center justify-center">
							<WaterUsageGauge ratio={waterRatio} />
						</div>
						<ul className="mt-4 space-y-2 text-[11px]">
							<li className="flex justify-between">
								<span className="text-neutral-400">Today</span>
								<span className="text-neutral-200">
									{overview.waterUsage.today}
								</span>
							</li>
							<li className="flex justify-between">
								<span className="text-neutral-400">7‑day avg</span>
								<span className="text-neutral-200">
									{overview.waterUsage.sevenDayAvg}
								</span>
							</li>
							<li className="flex justify-between">
								<span className="text-neutral-400">Projection</span>
								<span className="text-neutral-200">
									{overview.waterUsage.projection}
								</span>
							</li>
						</ul>
						{overview.waterUsage.notes && (
							<p className="mt-3 text-[10px] text-neutral-500 leading-relaxed">
								{overview.waterUsage.notes}
							</p>
						)}
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
							{activityFeed.length === 0 ? (
								<li className="text-xs text-neutral-500">
									No activity yet. As automations run and controllers sync,
									entries will appear here.
								</li>
							) : (
								activityFeed.map((ev) => (
									<li key={ev.eventId} className="flex gap-3">
										<span
											className={`mt-1.5 h-2 w-2 rounded-full ${activityColor(
												ev.category,
											)}`}
										/>
										<div className="flex-1 min-w-0">
											<p className="text-[13px] text-neutral-300 leading-snug">
												{ev.summary}
											</p>
											<p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-1 flex items-center gap-2">
												<span>{formatTime(ev.timestamp)}</span>
												{ev.actor && (
													<span className="text-neutral-700">/</span>
												)}
												{ev.actor && (
													<span className="font-medium text-neutral-400">
														{ev.actor}
													</span>
												)}
											</p>
										</div>
									</li>
								))
							)}
						</ol>
						<div className="mt-6 pt-4 border-t border-white/5">
							<Link
								href="/dashboard/activity"
								className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200"
							>
								View full activity →
							</Link>
						</div>
					</div>
					<div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col">
						<h2 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
							Alerts{" "}
							<span className="text-[10px] font-normal text-neutral-500">
								({alertsConfig.activeCount} active)
							</span>
						</h2>
						<p className="text-xs text-neutral-500 leading-relaxed">
							{overview.alertsSummary.description}
						</p>
						<div className="mt-6">
							<Link
								href="/dashboard/alerts"
								className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200"
							>
								Configure thresholds →
							</Link>
						</div>
						<div className="mt-8 text-[10px] text-neutral-600 border-t border-white/5 pt-4 leading-relaxed">
							{alertsConfig.notes ??
								"Wire real telemetry here to surface live risk scoring and auto-response history."}
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
						{overview.upcoming.length === 0 ? (
							<li className="rounded-xl border border-dashed border-white/10 bg-neutral-900/20 p-6 text-xs text-neutral-500">
								No schedules yet. Plan a pre-soak or maintenance window to see
								it here.
							</li>
						) : (
							overview.upcoming.map((item) => (
								<li
									key={item.id}
									className="rounded-xl border border-white/10 bg-neutral-900/40 p-4"
								>
									<div className="flex items-center justify-between gap-4">
										<div>
											<p className="text-sm font-medium text-white">
												{item.title}
											</p>
											{item.note && (
												<p className="text-[11px] text-neutral-500 mt-1">
													{item.note}
												</p>
											)}
										</div>
										<span className="text-[11px] px-2 py-1 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-neutral-300 whitespace-nowrap">
											{item.when}
										</span>
									</div>
								</li>
							))
						)}
					</ul>
					<div className="mt-6 pt-4 border-t border-white/5">
						<Link
							href="/dashboard/schedule"
							className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200"
						>
							View full schedule →
						</Link>
					</div>
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
