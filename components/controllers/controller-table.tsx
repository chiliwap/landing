"use client";

import { useTransition } from "react";
import type { Controller } from "@/lib/controllers";

interface Props {
	controllers: Controller[];
	highlightedId: string | null;
	onRowHover: (id: string | null) => void;
	actions: {
		toggle: (formData: FormData) => void | Promise<void>;
		sync: (formData: FormData) => void | Promise<void>;
		reboot: (formData: FormData) => void | Promise<void>;
	};
}

function statusDot(status: string) {
	switch (status) {
		case "online":
			return "bg-emerald-400";
		case "alert":
			return "bg-amber-400 animate-pulse";
		default:
			return "bg-neutral-500";
	}
}

function metricChip(label: string, value: string | undefined, intent?: string) {
	if (value === undefined) return null;
	const color =
		intent === "bad"
			? "bg-red-500/10 text-red-200 ring-red-500/30"
			: intent === "warn"
			? "bg-amber-400/15 text-amber-100 ring-amber-400/30"
			: intent === "good"
			? "bg-emerald-500/10 text-emerald-200 ring-emerald-500/30"
			: "bg-neutral-800/60 text-neutral-300 ring-neutral-700";
	return (
		<span
			key={label}
			className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${color}`}
		>
			{label} {value}
		</span>
	);
}

function tempIntent(v?: number) {
	if (v == null) return undefined;
	if (v >= 40) return "bad";
	if (v >= 32) return "warn";
	if (v >= 24) return "good";
	return undefined;
}

function stableAgo(iso: string) {
	const diff = Date.now() - new Date(iso).getTime();
	const min = Math.floor(diff / 60000);
	const hr = Math.floor(min / 60);
	const day = Math.floor(hr / 24);
	if (day >= 1) return `${day}d ago`;
	if (hr >= 1) return `${hr}h ago`;
	if (min >= 1) return `${min}m ago`;
	return "just now";
}

function ArmedToggle({
	ctrl,
	action,
}: {
	ctrl: Controller;
	action: (formData: FormData) => void | Promise<void>;
}) {
	const [isPending, startTransition] = useTransition();

	return (
		<form
			action={(formData) => {
				startTransition(() => action(formData));
			}}
		>
			<input type="hidden" name="id" value={ctrl.id} />
			<button
				type="submit"
				disabled={isPending}
				className={`cursor-pointer relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
					ctrl.armed
						? "bg-emerald-500/30 border-emerald-500/50"
						: "bg-neutral-700/50 border-neutral-600"
				}`}
				aria-pressed={ctrl.armed}
				aria-label={`${ctrl.armed ? "Disarm" : "Arm"} ${ctrl.name}`}
			>
				<span
					className={`inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200 ${
						ctrl.armed
							? "translate-x-[18px] bg-emerald-400"
							: "translate-x-[3px] bg-neutral-400"
					}`}
				/>
			</button>
		</form>
	);
}

function ActionButton({
	label,
	ctrl,
	action,
}: {
	label: string;
	ctrl: Controller;
	action: (formData: FormData) => void | Promise<void>;
}) {
	const [isPending, startTransition] = useTransition();

	return (
		<form
			action={(formData) => {
				startTransition(() => action(formData));
			}}
		>
			<input type="hidden" name="id" value={ctrl.id} />
			<button
				type="submit"
				disabled={isPending}
				className="cursor-pointer text-[10px] px-2 py-1 rounded-md border border-neutral-800 hover:border-neutral-600 bg-neutral-900/40 hover:bg-neutral-800/60 text-neutral-300 hover:text-neutral-100 transition disabled:opacity-50"
			>
				{isPending ? "..." : label}
			</button>
		</form>
	);
}

export default function ControllerTable({
	controllers,
	highlightedId,
	onRowHover,
	actions,
}: Props) {
	return (
		<div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
			<table className="w-full text-left text-sm">
				<thead className="text-[11px] uppercase tracking-wide text-neutral-500 bg-white/5">
					<tr>
						<th className="py-2.5 px-4 w-8" />
						<th className="py-2.5 px-4">Name</th>
						<th className="py-2.5 px-4 hidden sm:table-cell">Location</th>
						<th className="py-2.5 px-4 text-center">Armed</th>
						<th className="py-2.5 px-4 hidden md:table-cell">Metrics</th>
						<th className="py-2.5 px-4 hidden lg:table-cell">Last Seen</th>
						<th className="py-2.5 px-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-white/5">
					{controllers.length === 0 ? (
						<tr>
							<td colSpan={7} className="py-6 px-4 text-xs text-neutral-500 text-center">
								No controllers registered.
							</td>
						</tr>
					) : (
						controllers.map((ctrl) => (
							<tr
								key={ctrl.id}
								className={`transition-colors hover:bg-white/5 ${
									highlightedId === ctrl.id ? "bg-white/10" : ""
								}`}
								onMouseEnter={() => onRowHover(ctrl.id)}
								onMouseLeave={() => onRowHover(null)}
							>
								{/* Status dot */}
								<td className="py-2.5 px-4">
									<span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(ctrl.status)}`} />
								</td>

								{/* Name + firmware */}
								<td className="py-2.5 px-4">
									<div className="min-w-0">
										<p className="text-[13px] font-medium text-neutral-200 truncate max-w-[180px]">
											{ctrl.name}
										</p>
										<p className="text-[10px] text-neutral-500 font-mono">
											FW {ctrl.firmware}
										</p>
									</div>
								</td>

								{/* Location */}
								<td className="py-2.5 px-4 text-[12px] text-neutral-400 hidden sm:table-cell">
									{ctrl.location ?? "—"}
								</td>

								{/* Armed toggle */}
								<td className="py-2.5 px-4 text-center">
									<ArmedToggle ctrl={ctrl} action={actions.toggle} />
								</td>

								{/* Metrics */}
								<td className="py-2.5 px-4 hidden md:table-cell">
									<div className="flex flex-wrap gap-1">
										{metricChip(
											"Temp",
											ctrl.metrics.temperatureC != null
												? `${ctrl.metrics.temperatureC.toFixed(1)}°C`
												: undefined,
											tempIntent(ctrl.metrics.temperatureC),
										)}
										{metricChip(
											"Hum",
											ctrl.metrics.humidityPct != null
												? `${ctrl.metrics.humidityPct}%`
												: undefined,
										)}
										{metricChip(
											"Batt",
											ctrl.metrics.batteryPct != null
												? `${ctrl.metrics.batteryPct}%`
												: undefined,
										)}
									</div>
								</td>

								{/* Last Seen */}
								<td
									className="py-2.5 px-4 text-[11px] text-neutral-500 hidden lg:table-cell"
									suppressHydrationWarning
								>
									{stableAgo(ctrl.lastSeen)}
								</td>

								{/* Actions */}
								<td className="py-2.5 px-4">
									<div className="flex justify-end gap-1.5">
										<ActionButton label="Sync" ctrl={ctrl} action={actions.sync} />
										<ActionButton label="Reboot" ctrl={ctrl} action={actions.reboot} />
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
