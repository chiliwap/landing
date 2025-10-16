import { getUser, type User } from "@/lib/auth";

const events = [
	{
		id: "e1",
		ts: Date.now() - 1000 * 60 * 5,
		category: "automation",
		text: "Scheduled perimeter soak finished (3m, 24 L).",
	},
	{
		id: "e2",
		ts: Date.now() - 1000 * 60 * 25,
		category: "controller",
		text: "Controller Barn-West sync (temp 53°C, humidity 21%).",
	},
	{
		id: "e3",
		ts: Date.now() - 1000 * 60 * 60,
		category: "user",
		text: "User updated billing method (Visa •••• 4242).",
	},
	{
		id: "e4",
		ts: Date.now() - 1000 * 60 * 140,
		category: "controller",
		text: "Controller Ridge-Line armed.",
	},
	{
		id: "e5",
		ts: Date.now() - 1000 * 60 * 200,
		category: "alert",
		text: "Low humidity alert cleared.",
	},
];

const categoryColor: Record<string, string> = {
	automation: "bg-emerald-400",
	controller: "bg-sky-400",
	user: "bg-neutral-300",
	alert: "bg-rose-400",
};

export default async function ActivityPage() {
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
						Activity Log
					</h1>
					<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
						Chronological audit of automation runs, controller state
						transitions, and account actions. Demo entries only.
					</p>
				</div>
			</header>
			<div className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
				<section aria-labelledby="events" className="scroll-mt-24">
					<h2 id="events" className="sr-only">
						Events
					</h2>
					<ol className="space-y-5">
						{events.map((ev) => (
							<li key={ev.id} className="flex gap-4">
								<div className="pt-1">
									<span
										className={`inline-block h-2.5 w-2.5 rounded-full ${
											categoryColor[ev.category] || "bg-white/40"
										}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-[13px] text-neutral-300 leading-snug">
										{ev.text}
									</p>
									<div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wide text-neutral-500">
										<span>{formatTime(ev.ts)}</span>
										<span className="text-neutral-700">/</span>
										<span className="font-medium text-neutral-400">
											{ev.category}
										</span>
									</div>
								</div>
							</li>
						))}
					</ol>
				</section>
				<section aria-labelledby="notes" className="pb-4">
					<h2 id="notes" className="sr-only">
						Help
					</h2>
					<p className="text-[11px] text-neutral-500 leading-relaxed max-w-3xl">
						Persist a normalized event stream (type, ts, actor, payload hash)
						for long‑term auditability. For scale, partition by day or
						controller id. Consider a retention policy for verbose telemetry
						events.
					</p>
				</section>
			</div>
		</main>
	);
}
