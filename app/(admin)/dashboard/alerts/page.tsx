import { getUser, type User } from "@/lib/auth";

const thresholds = [
	{
		id: "t1",
		label: "High Temperature",
		trigger: "≥ 60°C",
		current: "54°C",
		status: "armed",
	},
	{
		id: "t2",
		label: "Low Humidity",
		trigger: "≤ 22%",
		current: "18%",
		status: "armed",
	},
	{
		id: "t3",
		label: "Wind Speed",
		trigger: "≥ 35km/h",
		current: "14km/h",
		status: "idle",
	},
];

const history = [
	{
		id: "h1",
		at: Date.now() - 1000 * 60 * 90,
		label: "Low humidity threshold crossed (auto‑soak queued)",
	},
	{
		id: "h2",
		at: Date.now() - 1000 * 60 * 300,
		label: "High temp alert cleared",
	},
];

export default async function AlertsPage() {
	const user: User | null = await getUser();
	if (!user) {
		return (
			<div className="p-10 text-center text-sm text-neutral-400">
				Not authenticated.
			</div>
		);
	}
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
						notifications. Values shown are demo only.
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
								{thresholds.map((t) => (
									<tr key={t.id} className="hover:bg-white/5 transition-colors">
										<td className="py-2.5 px-4 font-medium text-neutral-300 whitespace-nowrap">
											{t.label}
										</td>
										<td className="py-2.5 px-4 text-neutral-200">
											{t.trigger}
										</td>
										<td className="py-2.5 px-4 text-neutral-400">
											{t.current}
										</td>
										<td className="py-2.5 px-4">
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
													t.status === "armed"
														? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
														: "bg-neutral-500/10 text-neutral-400 ring-white/10"
												}`}
											>
												{t.status}
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
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section aria-labelledby="history" className="scroll-mt-24">
					<h2
						id="history"
						className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2"
					>
						Recent Alert Events{" "}
						<span className="text-[10px] font-normal text-neutral-500">
							({history.length})
						</span>
					</h2>
					<ol className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-6">
						{history.map((h) => (
							<li key={h.id} className="flex gap-3">
								<span className="mt-1.5 h-2 w-2 rounded-full bg-rose-400/80" />
								<div className="flex-1 min-w-0">
									<p className="text-[13px] text-neutral-300 leading-snug">
										{h.label}
									</p>
									<p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-1">
										{formatTime(h.at)}
									</p>
								</div>
							</li>
						))}
						{history.length === 0 && (
							<li className="text-xs text-neutral-500">
								No alert events in recent window.
							</li>
						)}
					</ol>
				</section>

				<section aria-labelledby="notes" className="pb-4">
					<h2 id="notes" className="sr-only">
						Help
					</h2>
					<p className="text-[11px] text-neutral-500 leading-relaxed max-w-3xl">
						Connect a real‑time ingestion pipeline (e.g. MQTT → processing →
						DynamoDB) to evaluate thresholds and push WebSocket notifications.
						Use feature flags to roll out new metrics safely.
					</p>
				</section>
			</div>
		</main>
	);
}
