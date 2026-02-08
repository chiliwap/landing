import { getUser, type User } from "@/lib/dal";
import {
	getDashboardSchedule,
	type ScheduleCategory,
	type ScheduleStatus,
} from "@/lib/dashboard";

const categoryColor: Record<ScheduleCategory, string> = {
	"pre-soak": "bg-sky-400",
	maintenance: "bg-amber-400",
	firmware: "bg-violet-400",
	inspection: "bg-emerald-400",
	custom: "bg-neutral-300",
};

const categoryLabel: Record<ScheduleCategory, string> = {
	"pre-soak": "Pre-Soak",
	maintenance: "Maintenance",
	firmware: "Firmware",
	inspection: "Inspection",
	custom: "Custom",
};

const statusBadge = (status: ScheduleStatus) => {
	switch (status) {
		case "scheduled":
			return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
		case "active":
			return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40";
		case "completed":
			return "bg-neutral-700/40 text-neutral-400 ring-white/10";
		case "cancelled":
			return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
	}
};

function formatDate(ts: number) {
	const d = new Date(ts);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

export default async function SchedulePage() {
	const user: User | null = await getUser();
	if (!user) {
		return (
			<div className="p-10 text-center text-sm text-neutral-400">
				Not authenticated.
			</div>
		);
	}

	const schedule = await getDashboardSchedule(user.id);
	const now = Date.now();

	const upcoming = schedule.items
		.filter((i) => i.status === "scheduled" || i.status === "active")
		.sort((a, b) => a.scheduledAt - b.scheduledAt);

	const past = schedule.items
		.filter((i) => i.status === "completed" || i.status === "cancelled")
		.sort((a, b) => b.scheduledAt - a.scheduledAt);

	return (
		<main className="pb-24">
			<header className="border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 py-10">
					<h1 className="text-3xl font-semibold tracking-tight text-white">
						Schedule
					</h1>
					<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
						Upcoming pre-soaks, maintenance windows, firmware updates, and
						inspections. {upcoming.length} event
						{upcoming.length === 1 ? "" : "s"} pending.
					</p>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-6 mt-10 space-y-14">
				{/* Upcoming & Active */}
				<section aria-labelledby="upcoming" className="scroll-mt-24">
					<h2
						id="upcoming"
						className="text-sm font-semibold text-neutral-200 mb-4"
					>
						Upcoming & Active
					</h2>
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
						<table className="w-full text-left text-sm">
							<thead className="text-[11px] uppercase tracking-wide text-neutral-500 bg-white/5">
								<tr>
									<th className="py-2.5 px-4">Event</th>
									<th className="py-2.5 px-4">Category</th>
									<th className="py-2.5 px-4">When</th>
									<th className="py-2.5 px-4">Duration</th>
									<th className="py-2.5 px-4">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{upcoming.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="py-6 px-4 text-xs text-neutral-500 text-center"
										>
											No upcoming events. Schedule a pre-soak or maintenance
											window to see it here.
										</td>
									</tr>
								) : (
									upcoming.map((item) => (
										<tr
											key={item.id}
											className="hover:bg-white/5 transition-colors"
										>
											<td className="py-2.5 px-4">
												<div className="flex items-center gap-2">
													<span
														className={`h-2 w-2 rounded-full ${categoryColor[item.category]}`}
													/>
													<div className="min-w-0">
														<p className="font-medium text-neutral-300 whitespace-nowrap">
															{item.title}
														</p>
														{item.controllerName && (
															<p className="text-[10px] text-neutral-500 mt-0.5">
																{item.controllerName}
															</p>
														)}
													</div>
												</div>
											</td>
											<td className="py-2.5 px-4 text-neutral-400 text-xs">
												{categoryLabel[item.category]}
											</td>
											<td className="py-2.5 px-4 text-neutral-200 whitespace-nowrap">
												{formatDate(item.scheduledAt)}
											</td>
											<td className="py-2.5 px-4 text-neutral-400">
												{item.durationMinutes}m
											</td>
											<td className="py-2.5 px-4">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusBadge(item.status)}`}
												>
													{item.status}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</section>

				{/* Past Events */}
				<section aria-labelledby="past" className="scroll-mt-24">
					<h2
						id="past"
						className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2"
					>
						Past Events
						<span className="text-[10px] font-normal text-neutral-500">
							({past.length})
						</span>
					</h2>
					<ol className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-6">
						{past.length === 0 ? (
							<li className="text-xs text-neutral-500">
								No past events yet. Completed and cancelled events will appear
								here.
							</li>
						) : (
							past.map((item) => (
								<li key={item.id} className="flex gap-3">
									<span
										className={`mt-1.5 h-2 w-2 rounded-full ${categoryColor[item.category]}`}
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="text-[13px] text-neutral-300 leading-snug">
												{item.title}
											</p>
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusBadge(item.status)}`}
											>
												{item.status}
											</span>
										</div>
										<p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-1 flex items-center gap-2">
											<span>{formatDate(item.scheduledAt)}</span>
											<span className="text-neutral-700">/</span>
											<span className="font-medium text-neutral-400">
												{categoryLabel[item.category]}
											</span>
											{item.controllerName && (
												<>
													<span className="text-neutral-700">/</span>
													<span className="font-medium text-neutral-400">
														{item.controllerName}
													</span>
												</>
											)}
										</p>
										{item.note && (
											<p className="text-[11px] text-neutral-500 mt-1">
												{item.note}
											</p>
										)}
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
						Schedules are stored per-user and evaluated against controller
						availability at execution time. In production, a scheduler service
						would poll upcoming items and dispatch commands via the controller
						API.
					</p>
				</section>
			</div>
		</main>
	);
}
