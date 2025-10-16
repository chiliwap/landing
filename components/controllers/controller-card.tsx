"use client";
import * as React from "react";
import Image from "next/image";

interface Props {
	ctrl: {
		id: string;
		name: string;
		status: string;
		lastSeen: string;
		firmware: string;
		armed: boolean;
		metrics: {
			temperatureC?: number;
			humidityPct?: number;
			batteryPct?: number;
			signalPct?: number;
		};
		location?: string;
	};
	actions: {
		rename: (formData: FormData) => void | Promise<void>;
		toggle: (formData: FormData) => void | Promise<void>;
		sync: (formData: FormData) => void | Promise<void>;
		reboot: (formData: FormData) => void | Promise<void>;
	};
}

// List-row layout with thumbnail & enhanced metric chips
export default function ControllerCard({ ctrl, actions }: Props) {
	const [editing, setEditing] = React.useState(false);
	const [name, setName] = React.useState(ctrl.name);
	const [imgSrc, setImgSrc] = React.useState("/opta.webp");
	React.useEffect(() => setName(ctrl.name), [ctrl.name]);
	const status = ctrl.status as StatusKind;
	const onError = React.useCallback(() => setImgSrc("/poster.webp"), []);

	const metrics: Array<{ k: string; v?: string; intent?: string }> = [
		{
			k: "Temp",
			v:
				ctrl.metrics.temperatureC != null
					? ctrl.metrics.temperatureC.toFixed(1) + "°C"
					: undefined,
			intent: tempIntent(ctrl.metrics.temperatureC),
		},
		{
			k: "Hum",
			v:
				ctrl.metrics.humidityPct != null
					? ctrl.metrics.humidityPct + "%"
					: undefined,
		},
		{
			k: "Batt",
			v:
				ctrl.metrics.batteryPct != null
					? ctrl.metrics.batteryPct + "%"
					: undefined,
			intent: batteryIntent(ctrl.metrics.batteryPct),
		},
		{
			k: "Sig",
			v:
				ctrl.metrics.signalPct != null
					? ctrl.metrics.signalPct + "%"
					: undefined,
			intent: signalIntent(ctrl.metrics.signalPct),
		},
	];

	return (
		<div
			className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 hover:bg-neutral-900/70 hover:border-neutral-700 transition-colors p-4 flex flex-col gap-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
			role="region"
			aria-label={`Controller ${ctrl.name}`}
		>
			{/* HEADER AREA */}
			<div className="flex flex-wrap md:flex-nowrap items-start gap-4 min-w-0">
				{/* Thumbnail + status dot */}
				<div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden ring-1 ring-inset ring-neutral-800 bg-neutral-900">
					<Image
						src={imgSrc}
						alt={ctrl.name}
						width={56}
						height={56}
						onError={onError}
						className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
					<span className="absolute bottom-1 right-1 inline-flex items-center justify-center h-4 w-4 rounded-full ring-1 ring-neutral-950 shadow bg-neutral-950/80">
						<span
							className={`h-2.5 w-2.5 rounded-full ${statusStyle(status).dot}`}
						/>
					</span>
				</div>

				{/* Name + meta */}
				<div className="flex-1 min-w-0 flex flex-col gap-2">
					<div className="flex items-start gap-2 min-w-0 flex-wrap">
						{editing ? (
							<form
								action={actions.rename}
								className="flex items-center gap-2 min-w-[160px]"
								aria-label="Rename controller"
							>
								<input type="hidden" name="id" value={ctrl.id} />
								<input
									name="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="bg-neutral-900 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-neutral-500 min-w-0 flex-1"
									autoFocus
									maxLength={80}
								/>
								<button
									type="submit"
									onClick={() => setEditing(false)}
									className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={() => {
										setName(ctrl.name);
										setEditing(false);
									}}
									className="text-[10px] px-2 py-1 rounded bg-transparent hover:bg-neutral-800 text-neutral-400"
								>
									Cancel
								</button>
							</form>
						) : (
							<>
								<h3
									className="text-sm font-medium tracking-tight text-white truncate max-w-[180px]"
									title={ctrl.name}
								>
									{ctrl.name}
								</h3>
								<button
									onClick={() => setEditing(true)}
									className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded border border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-neutral-200"
									aria-label="Edit name"
								>
									Edit
								</button>
							</>
						)}
						<span
							className="text-[10px] font-mono text-neutral-500 truncate max-w-[90px]"
							title={ctrl.id}
						>
							{shortId(ctrl.id)}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-2 items-stretch ml-auto min-w-[84px]">
					<form action={actions.toggle}>
						<input type="hidden" name="id" value={ctrl.id} />
						<button
							type="submit"
							className={`w-full cursor-pointer text-[11px] px-2 py-1.5 rounded-md border font-medium transition text-left ${
								ctrl.armed
									? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15"
									: "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
							}`}
							aria-pressed={ctrl.armed}
						>
							{ctrl.armed ? "Active" : "Idle"}
						</button>
					</form>
					<div className="hidden sm:flex gap-1">
						<form action={actions.sync} className="flex-1">
							<input type="hidden" name="id" value={ctrl.id} />
							<GhostButton label="Sync" />
						</form>
						<form action={actions.reboot} className="flex-1">
							<input type="hidden" name="id" value={ctrl.id} />
							<GhostButton label="Reboot" />
						</form>
					</div>
				</div>
			</div>

			{/* META GRID (responsive wrap) */}
			<div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] leading-relaxed text-neutral-400 self-center">
				<span
					className="truncate max-w-[160px]"
					title={ctrl.location || "No location"}
				>
					{ctrl.location || "No location"}
				</span>
				<span className="opacity-30">/</span>
				<span
					className="truncate max-w-[80px]"
					suppressHydrationWarning
					title={utcTimestamp(ctrl.lastSeen)}
				>
					{stableAgo(ctrl.lastSeen)}
				</span>
				<span className="opacity-30 hidden sm:inline">/</span>
				<span
					className="truncate hidden sm:inline max-w-[120px]"
					title={ctrl.firmware}
				>
					FW {ctrl.firmware}
				</span>
			</div>

			{/* METRICS ROW */}
			<div className="flex flex-wrap gap-2 -m-1 pt-0">
				{metrics.map((m) => (
					<CompactMetric key={m.k} label={m.k} value={m.v} intent={m.intent} />
				))}
			</div>
		</div>
	);
}

// -------------------- Subcomponents --------------------

type StatusKind = "online" | "alert" | string;

// Replaces previous overlay badge: inline dot next to name
function StatusInlineDot({ status }: { status: StatusKind }) {
	const s = statusStyle(status);
	return (
		<span
			className={`relative inline-flex h-2.5 w-2.5 rounded-full ${s.dot}`}
			aria-label={`Status ${status}`}
		/>
	);
}

function MetricChip({
	label,
	value,
	intent,
}: {
	label: string;
	value?: string;
	intent?: string;
}) {
	const tone =
		intent === "bad"
			? "red"
			: intent === "warn"
			? "amber"
			: intent === "good"
			? "emerald"
			: "neutral";
	const pal: Record<
		string,
		{ ring: string; text: string; bg: string; icon: string }
	> = {
		red: {
			ring: "ring-red-500/35",
			text: "text-red-200",
			bg: "bg-red-500/10",
			icon: "text-red-300",
		},
		amber: {
			ring: "ring-amber-400/35",
			text: "text-amber-100",
			bg: "bg-amber-400/15",
			icon: "text-amber-300",
		},
		emerald: {
			ring: "ring-emerald-500/35",
			text: "text-emerald-200",
			bg: "bg-emerald-500/10",
			icon: "text-emerald-300",
		},
		neutral: {
			ring: "ring-neutral-700",
			text: "text-neutral-300",
			bg: "bg-neutral-800/60",
			icon: "text-neutral-400",
		},
	};
	const p = pal[tone];
	return (
		<span
			className={`inline-flex items-center gap-1 h-5 rounded-full px-2 text-[10px] font-medium ring-1 ${p.ring} ${p.bg} backdrop-blur-sm transition hover:brightness-110 whitespace-nowrap`}
			title={value ? `${label}: ${value}` : `${label}: No data`}
		>
			<MetricIcon k={label} className={`h-3 w-3 ${p.icon}`} />
			<span className="uppercase tracking-wide opacity-70">{label}</span>
			<span className={`tabular-nums ${p.text}`}>{value || "—"}</span>
		</span>
	);
}

// Larger tile variant for grid layout
function MetricTile({
	label,
	value,
	intent,
}: {
	label: string;
	value?: string;
	intent?: string;
}) {
	const tone =
		intent === "bad"
			? "red"
			: intent === "warn"
			? "amber"
			: intent === "good"
			? "emerald"
			: "neutral";
	const pal: Record<
		string,
		{ ring: string; text: string; bg: string; icon: string; subtle: string }
	> = {
		red: {
			ring: "ring-red-500/40",
			text: "text-red-200",
			bg: "bg-red-500/10",
			icon: "text-red-300",
			subtle: "text-red-400/70",
		},
		amber: {
			ring: "ring-amber-400/40",
			text: "text-amber-100",
			bg: "bg-amber-400/15",
			icon: "text-amber-300",
			subtle: "text-amber-300/70",
		},
		emerald: {
			ring: "ring-emerald-500/40",
			text: "text-emerald-200",
			bg: "bg-emerald-500/10",
			icon: "text-emerald-300",
			subtle: "text-emerald-300/70",
		},
		neutral: {
			ring: "ring-neutral-700",
			text: "text-neutral-200",
			bg: "bg-neutral-900/70",
			icon: "text-neutral-400",
			subtle: "text-neutral-400/70",
		},
	};
	const p = pal[tone];
	return (
		<div
			className={`relative rounded-md border border-neutral-800/70 ${p.bg} ring-1 ${p.ring} px-2.5 py-2 flex flex-col gap-1.5 hover:border-neutral-600 transition group`}
			title={value ? `${label}: ${value}` : `${label}: No data`}
		>
			<div className="flex items-center justify-between gap-1">
				<div className="flex items-center gap-1.5 min-w-0">
					<MetricIcon k={label} className={`h-4 w-4 ${p.icon}`} />
					<span className="text-[11px] font-medium tracking-wide uppercase text-neutral-300/80 group-hover:text-neutral-200">
						{label}
					</span>
				</div>
				<span className={`text-[10px] font-mono ${p.subtle}`}>
					{value ? "LIVE" : "—"}
				</span>
			</div>
			<div
				className={`text-sm font-semibold tabular-nums leading-none ${p.text}`}
			>
				{value || "—"}
			</div>
			<div className="h-px bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent" />
			<div className="flex items-center justify-between text-[10px] text-neutral-500">
				<span className="capitalize">{labelFull(label)}</span>
				{value && <span className="opacity-70">Now</span>}
			</div>
		</div>
	);
}

// Compact metric chip (new layout variant replacing full tiles)
function CompactMetric({
	label,
	value,
	intent,
}: {
	label: string;
	value?: string;
	intent?: string;
}) {
	const tone =
		intent === "bad"
			? "red"
			: intent === "warn"
			? "amber"
			: intent === "good"
			? "emerald"
			: "neutral";
	const pal: Record<
		string,
		{ ring: string; text: string; bg: string; icon: string }
	> = {
		red: {
			ring: "ring-red-500/35",
			text: "text-red-200",
			bg: "bg-red-500/10",
			icon: "text-red-300",
		},
		amber: {
			ring: "ring-amber-400/35",
			text: "text-amber-100",
			bg: "bg-amber-400/15",
			icon: "text-amber-300",
		},
		emerald: {
			ring: "ring-emerald-500/35",
			text: "text-emerald-200",
			bg: "bg-emerald-500/10",
			icon: "text-emerald-300",
		},
		neutral: {
			ring: "ring-neutral-700",
			text: "text-neutral-200",
			bg: "bg-neutral-900/70",
			icon: "text-neutral-400",
		},
	};
	const p = pal[tone];
	return (
		<div
			className={`m-1 flex items-center gap-1.5 rounded-md border border-neutral-800/70 ${p.bg} ring-1 ${p.ring} px-2 py-1.5 min-w-[90px] grow basis-[100px] hover:border-neutral-600 transition`}
			title={
				value ? `${labelFull(label)}: ${value}` : `${labelFull(label)}: No data`
			}
		>
			<MetricIcon k={label} className={`h-3.5 w-3.5 ${p.icon}`} />
			<div className="flex flex-col leading-tight min-w-0">
				<span className="text-[10px] uppercase tracking-wide text-neutral-400/80">
					{label}
				</span>
				<span
					className={`text-[11px] font-medium tabular-nums ${p.text} truncate`}
				>
					{value || "—"}
				</span>
			</div>
		</div>
	);
}

function MetricIcon({ k, className }: { k: string; className?: string }) {
	switch (k) {
		case "Temp":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 2a2 2 0 0 0-2 2v9.17a3.001 3.001 0 1 0 4 0V4a2 2 0 0 0-2-2Z" />
				</svg>
			);
		case "Hum":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 2.5c-1.2 2.4-5 6.3-5 9.5a5 5 0 0 0 10 0c0-3.2-3.8-7.1-5-9.5Z" />
				</svg>
			);
		case "Batt":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="2" y="7" width="18" height="10" rx="2" />
					<path d="M22 11v4" />
				</svg>
			);
		case "Sig":
			return (
				<svg
					className={className}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M2 20h.01" />
					<path d="M6 20a4 4 0 0 0-4-4" />
					<path d="M10 20c0-4.418-3.582-8-8-8" />
					<path d="M14 20c0-6.627-5.373-12-12-12" />
				</svg>
			);
		default:
			return <span className={className}>•</span>;
	}
}

// (Removed deprecated MetricPill & StatusBadge components from previous design.)

function KV({
	label,
	value,
	mono,
}: {
	label: string;
	value: string;
	mono?: boolean;
}) {
	return (
		<div className="flex flex-col min-w-0">
			<span className="text-[10px] uppercase tracking-wide text-neutral-500 mb-0.5">
				{label}
			</span>
			<span
				className={`text-[11px] text-neutral-200 truncate ${
					mono ? "font-mono" : ""
				}`}
				title={value}
			>
				{value}
			</span>
		</div>
	);
}

// -------------------- Helpers --------------------

function statusStyle(status: StatusKind) {
	switch (status) {
		case "online":
			return {
				chipText: "text-emerald-300",
				dot: "bg-emerald-400 animate-pulse",
			};
		case "alert":
			return { chipText: "text-amber-300", dot: "bg-amber-400 animate-pulse" };
		default:
			return { chipText: "text-neutral-400", dot: "bg-neutral-500" };
	}
}

// statusAccent removed for minimal aesthetic.

// Removed accent color hashing for simplified visual language.

// (clamp retained earlier for potential future scaling use — remove if unused elsewhere.)
function clamp(v: number, lo: number, hi: number) {
	return Math.min(Math.max(v, lo), hi);
}

function GhostButton({ label }: { label: string }) {
	return (
		<button
			type="submit"
			className="cursor-pointer h-7 px-2 rounded-md text-[10.5px] border border-neutral-800 hover:border-neutral-600 bg-neutral-900/40 hover:bg-neutral-800/60 text-neutral-300 hover:text-neutral-100 transition"
		>
			{label}
		</button>
	);
}

function healthLine(metrics: Props["ctrl"]["metrics"]) {
	const parts: string[] = [];
	if (metrics.temperatureC != null)
		parts.push(`Temp ${metrics.temperatureC.toFixed(1)}°C`);
	if (metrics.humidityPct != null) parts.push(`Hum ${metrics.humidityPct}%`);
	if (metrics.batteryPct != null) parts.push(`Batt ${metrics.batteryPct}%`);
	if (metrics.signalPct != null) parts.push(`Sig ${metrics.signalPct}%`);
	return parts.length ? parts.join(" · ") : "No telemetry available";
}

function healthCompact(metrics: Props["ctrl"]["metrics"]) {
	const seg: string[] = [];
	if (metrics.temperatureC != null)
		seg.push(`${metrics.temperatureC.toFixed(0)}°C`);
	if (metrics.humidityPct != null) seg.push(`${metrics.humidityPct}%RH`);
	if (metrics.batteryPct != null) seg.push(`${metrics.batteryPct}%Batt`);
	if (seg.length === 0) return "no data";
	return seg.slice(0, 3).join(" · ");
}

function shortId(id: string) {
	if (id.length <= 10) return id;
	return id.slice(0, 4) + "…" + id.slice(-4);
}

function utcTimestamp(iso: string) {
	const d = new Date(iso);
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
		2,
		"0"
	)}-${String(d.getUTCDate()).padStart(2, "0")} ${String(
		d.getUTCHours()
	).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

function stableAgo(iso: string) {
	const d = new Date(iso);
	const diff = Date.now() - d.getTime();
	const min = Math.floor(diff / 60000);
	const hr = Math.floor(min / 60);
	const day = Math.floor(hr / 24);
	if (day > 7) return shortUTC(d);
	if (day >= 1) return `${day}d ago`;
	if (hr >= 1) return `${hr}h ago`;
	if (min >= 1) return `${min}m ago`;
	return "just now";
}

function shortUTC(d: Date) {
	const m = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	][d.getUTCMonth()];
	return `${m} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
}

function tempIntent(v?: number) {
	if (v == null) return undefined;
	if (v >= 40) return "bad";
	if (v >= 32) return "warn";
	if (v >= 24) return "good";
}
function batteryIntent(v?: number) {
	if (v == null) return undefined;
	if (v < 25) return "bad";
	if (v < 50) return "warn";
	if (v > 80) return "good";
}
function signalIntent(v?: number) {
	if (v == null) return undefined;
	if (v < 30) return "bad";
	if (v < 60) return "warn";
	if (v > 85) return "good";
}

function labelFull(short: string) {
	switch (short) {
		case "Temp":
			return "Temperature";
		case "Hum":
			return "Humidity";
		case "Batt":
			return "Battery";
		case "Sig":
			return "Signal";
		default:
			return short;
	}
}
