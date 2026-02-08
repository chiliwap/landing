import { getUser, type User } from "@/lib/dal";
import { getDashboardAlertConfig } from "@/lib/dashboard";

const statusBadge = (status: string) => {
	switch (status) {
		case "armed":
			return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40";
		case "disabled":
			return "bg-neutral-700/40 text-neutral-400 ring-white/10";
		case "idle":
			return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
		default:
			return "bg-amber-500/15 text-amber-200 ring-amber-500/30";
	}
};

export default async function AlertsPage() {
	const user: User | null = await getUser();
	if (!user) {
		return (
			<div className="p-10 text-center text-sm text-neutral-400">
				Not authenticated.
			</div>
		);
	}

	const config = await getDashboardAlertConfig(user.id);
	const formatTime = (ts: number) =>
		new Date(ts).toISOString().slice(11, 16) + " UTC";

	return (
		<main className="pb-24">
			<header className="border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 py-10">
					<h1 className="text-3xl font-semibold tracking-tight text-white">
						Alerts & Thresholds
					</h1>
					<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
						Configure trigger points that initiate protective automation or send
						notifications. {config.activeCount} threshold
						{config.activeCount === 1 ? " is" : "s are"} currently armed.
					</p>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-6 mt-10 space-y-14">
				<section aria-labelledby="configured" className="scroll-mt-24">
					<h2
						id="configured"
						className="text-sm font-semibold text-neutral-200 mb-4"
					>
						Configured Thresholds
					</h2>
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
						<table className="w-full text-left text-sm">
							<thead className="text-[11px] uppercase tracking-wide text-neutral-500 bg-white/5">
								<tr>
									<th className="py-2.5 px-4">Metric</th>
									<th className="py-2.5 px-4">Trigger</th>
									<th className="py-2.5 px-4">Current</th>
									<th className="py-2.5 px-4">Status</th>
									<th className="py-2.5 px-4 text-right">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{config.thresholds.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="py-6 px-4 text-xs text-neutral-500 text-center"
										>
											No thresholds armed yet. Add humidity, temperature, or
											wind triggers to automate mitigation when conditions
											escalate.
										</td>
									</tr>
								) : (
									config.thresholds.map((threshold) => (
										<tr
											key={threshold.id}
											className="hover:bg-white/5 transition-colors"
										>
											<td className="py-2.5 px-4 font-medium text-neutral-300 whitespace-nowrap">
												{threshold.label}
											</td>
											<td className="py-2.5 px-4 text-neutral-200">
												{threshold.trigger}
											</td>
											<td className="py-2.5 px-4 text-neutral-400">
												{threshold.current}
											</td>
											<td className="py-2.5 px-4">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusBadge(
														threshold.status
													)}`}
												>
													{threshold.status}
												</span>
											</td>
											<td className="py-2.5 px-4 text-right">
												<div className="flex justify-end gap-2">
													<button className="cursor-pointer text-[11px] font-medium text-neutral-300 hover:text-white">
														Edit
													</button>
													<button className="cursor-pointer text-[11px] font-medium text-neutral-400 hover:text-red-300">
														Disable
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</section>

				<section aria-labelledby="history" className="scroll-mt-24">
					<h2
						id="history"
						className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2"
					>
						Recent Alert Events
						<span className="text-[10px] font-normal text-neutral-500">
							({config.history.length})
						</span>
					</h2>
					<ol className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-6">
						{config.history.length === 0 ? (
							<li className="text-xs text-neutral-500">
								No alert events recorded yet. Events will appear here once
								controllers report threshold crossings.
							</li>
						) : (
							config.history.map((entry) => (
								<li key={entry.id} className="flex gap-3">
									<span className="mt-1.5 h-2 w-2 rounded-full bg-rose-400/80" />
									<div className="flex-1 min-w-0">
										<p className="text-[13px] text-neutral-300 leading-snug">
											{entry.label}
										</p>
										<p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-1">
											{formatTime(entry.timestamp)}
										</p>
									</div>
								</li>
							))
						)}
					</ol>
				</section>

				<section aria-labelledby="notes" className="pb-4">
					<h2 id="notes" className="sr-only">
						Help
					</h2>
					<p className="text-[11px] text-neutral-500 leading-relaxed max-w-3xl">
						{config.notes ??
							"Connect telemetry ingestion (MQTT → stream processing → DynamoDB) to update thresholds in real time. Use staged rollouts and IAM-scoped access when enabling new alert metrics."}
					</p>
				</section>
			</div>
		</main>
	);
}
