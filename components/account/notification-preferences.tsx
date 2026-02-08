"use client";

import { useState } from "react";

type Channel = "email" | "sms" | "push";
type AlertType = "system" | "threshold" | "maintenance" | "billing";

const CHANNELS: { id: Channel; label: string }[] = [
	{ id: "email", label: "Email" },
	{ id: "sms", label: "SMS" },
	{ id: "push", label: "Push" },
];

const ALERT_TYPES: { id: AlertType; label: string }[] = [
	{ id: "system", label: "System Alerts" },
	{ id: "threshold", label: "Threshold Exceeded" },
	{ id: "maintenance", label: "Maintenance" },
	{ id: "billing", label: "Billing" },
];

function ChannelIcon({ channel, className }: { channel: Channel; className?: string }) {
	switch (channel) {
		case "email":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
				</svg>
			);
		case "sms":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			);
		case "push":
			return (
				<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
					<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
				</svg>
			);
	}
}

export default function NotificationPreferences() {
	const [channels, setChannels] = useState<Record<Channel, boolean>>({
		email: true,
		sms: false,
		push: true,
	});

	const [routing, setRouting] = useState<Record<AlertType, Record<Channel, boolean>>>({
		system: { email: true, sms: false, push: true },
		threshold: { email: true, sms: true, push: true },
		maintenance: { email: true, sms: false, push: false },
		billing: { email: true, sms: false, push: false },
	});

	const toggleChannel = (ch: Channel) => {
		setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));
	};

	const toggleRouting = (alert: AlertType, ch: Channel) => {
		if (!channels[ch]) return;
		setRouting((prev) => ({
			...prev,
			[alert]: { ...prev[alert], [ch]: !prev[alert][ch] },
		}));
	};

	return (
		<div className="space-y-8">
			<div>
				<h3 className="text-sm font-semibold text-neutral-200 mb-1">
					Notification Preferences
				</h3>
				<p className="text-[11px] text-neutral-500 leading-relaxed max-w-xl">
					Choose which channels can deliver notifications and route
					specific alert types to the channels you prefer.
				</p>
			</div>

			{/* Delivery Channels */}
			<div>
				<h4 className="text-xs font-medium uppercase tracking-wide text-neutral-400 mb-3">
					Delivery Channels
				</h4>
				<div className="space-y-2">
					{CHANNELS.map((ch) => (
						<label
							key={ch.id}
							className="flex items-center gap-3 rounded-lg border border-white/10 bg-neutral-900/40 px-4 py-3 cursor-pointer hover:bg-white/5 transition"
						>
							<input
								type="checkbox"
								checked={channels[ch.id]}
								onChange={() => toggleChannel(ch.id)}
								className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 accent-emerald-500"
							/>
							<ChannelIcon channel={ch.id} className="h-4 w-4 text-neutral-400" />
							<span className="text-sm text-neutral-200">{ch.label}</span>
							{!channels[ch.id] && (
								<span className="ml-auto text-[10px] text-neutral-600">
									Disabled
								</span>
							)}
						</label>
					))}
				</div>
			</div>

			{/* Alert Type Routing */}
			<div>
				<h4 className="text-xs font-medium uppercase tracking-wide text-neutral-400 mb-3">
					Alert Type Routing
				</h4>
				<div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/40">
					<table className="w-full text-left text-sm">
						<thead className="text-[11px] uppercase tracking-wide text-neutral-500 bg-white/5">
							<tr>
								<th className="py-2.5 px-4">Alert Type</th>
								{CHANNELS.map((ch) => (
									<th key={ch.id} className="py-2.5 px-4 text-center">
										{ch.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5">
							{ALERT_TYPES.map((alert) => (
								<tr key={alert.id} className="hover:bg-white/5 transition-colors">
									<td className="py-2.5 px-4 text-[13px] text-neutral-300">
										{alert.label}
									</td>
									{CHANNELS.map((ch) => {
										const enabled = channels[ch.id];
										const active = routing[alert.id][ch.id];
										return (
											<td key={ch.id} className="py-2.5 px-4 text-center">
												<button
													type="button"
													onClick={() => toggleRouting(alert.id, ch.id)}
													disabled={!enabled}
													className={`cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-medium ring-1 ring-inset transition ${
														!enabled
															? "bg-neutral-800/40 ring-white/5 text-neutral-700 cursor-not-allowed"
															: active
															? "bg-emerald-500/15 ring-emerald-500/40 text-emerald-300"
															: "bg-neutral-800/60 ring-white/10 text-neutral-500 hover:bg-white/5"
													}`}
												>
													{active && enabled ? (
														<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
															<polyline points="20 6 9 17 4 12" />
														</svg>
													) : (
														<span className="opacity-40">-</span>
													)}
												</button>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<p className="text-[10px] text-neutral-600 leading-relaxed">
				Notification preferences are stored locally for demonstration
				purposes. In production these would persist to your account
				settings via API.
			</p>
		</div>
	);
}
