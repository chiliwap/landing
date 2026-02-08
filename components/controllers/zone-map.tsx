"use client";

import { useState } from "react";
import type { Controller } from "@/lib/controllers";

interface Props {
	controllers: Controller[];
	highlightedId: string | null;
	onHighlight: (id: string | null) => void;
}

const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
	"Front Pump House": { x: 160, y: 260 },
	"North Tree Line": { x: 340, y: 80 },
	"Rear Slope": { x: 480, y: 200 },
};

const DEFAULT_COORD = { x: 300, y: 180 };

function statusColor(status: string) {
	switch (status) {
		case "online":
			return "fill-emerald-400";
		case "alert":
			return "fill-amber-400";
		default:
			return "fill-neutral-500";
	}
}

function statusStroke(status: string) {
	switch (status) {
		case "online":
			return "stroke-emerald-400/40";
		case "alert":
			return "stroke-amber-400/40";
		default:
			return "stroke-neutral-500/40";
	}
}

export default function ZoneMap({ controllers, highlightedId, onHighlight }: Props) {
	const [hoveredId, setHoveredId] = useState<string | null>(null);

	return (
		<div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
			<h2 className="text-sm font-semibold text-neutral-200 mb-4">
				Property Zone Map
			</h2>
			<svg
				viewBox="0 0 640 340"
				className="w-full h-auto"
				role="img"
				aria-label="Property zone map showing controller positions"
			>
				{/* Background */}
				<rect x="0" y="0" width="640" height="340" rx="12" fill="none" className="stroke-white/5" strokeWidth="1" />

				{/* Property outline */}
				<polygon
					points="40,300 40,60 200,30 560,50 600,180 540,310 120,320"
					fill="none"
					className="stroke-white/10"
					strokeWidth="1.5"
					strokeDasharray="6 3"
				/>

				{/* House */}
				<rect x="220" y="160" width="80" height="60" rx="4" className="fill-white/[0.03] stroke-white/10" strokeWidth="1" />
				<text x="260" y="195" textAnchor="middle" className="fill-neutral-600 text-[10px]" fontSize="10">House</text>

				{/* Trees */}
				{[
					{ cx: 100, cy: 100 },
					{ cx: 130, cy: 130 },
					{ cx: 400, cy: 100 },
					{ cx: 440, cy: 280 },
					{ cx: 500, cy: 130 },
				].map((t, i) => (
					<circle key={i} cx={t.cx} cy={t.cy} r="12" className="fill-emerald-900/20 stroke-emerald-800/20" strokeWidth="1" />
				))}

				{/* Driveway */}
				<path d="M260 220 L260 310" className="stroke-white/[0.06]" strokeWidth="8" strokeLinecap="round" />

				{/* Controller markers */}
				{controllers.map((ctrl) => {
					const pos = LOCATION_COORDS[ctrl.location ?? ""] ?? DEFAULT_COORD;
					const isHovered = hoveredId === ctrl.id;
					const isHighlighted = highlightedId === ctrl.id;
					const active = isHovered || isHighlighted;

					return (
						<g
							key={ctrl.id}
							onMouseEnter={() => {
								setHoveredId(ctrl.id);
								onHighlight(ctrl.id);
							}}
							onMouseLeave={() => {
								setHoveredId(null);
								onHighlight(null);
							}}
							onClick={() => onHighlight(ctrl.id === highlightedId ? null : ctrl.id)}
							className="cursor-pointer"
						>
							{/* Pulse ring on active */}
							{active && (
								<circle
									cx={pos.x}
									cy={pos.y}
									r="18"
									fill="none"
									className={statusStroke(ctrl.status)}
									strokeWidth="2"
								>
									<animate attributeName="r" from="14" to="22" dur="1.5s" repeatCount="indefinite" />
									<animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
								</circle>
							)}

							{/* Outer circle */}
							<circle
								cx={pos.x}
								cy={pos.y}
								r={active ? 12 : 10}
								className={`${statusColor(ctrl.status)} transition-all duration-200`}
								opacity={active ? 1 : 0.85}
							/>

							{/* Inner dot */}
							<circle
								cx={pos.x}
								cy={pos.y}
								r="3.5"
								fill="white"
								opacity={0.9}
							/>

							{/* Tooltip on hover */}
							{active && (
								<g>
									<rect
										x={pos.x - 60}
										y={pos.y - 36}
										width="120"
										height="22"
										rx="4"
										className="fill-neutral-800"
										stroke="none"
									/>
									<text
										x={pos.x}
										y={pos.y - 21}
										textAnchor="middle"
										className="fill-neutral-200 text-[11px]"
										fontSize="11"
									>
										{ctrl.name}
									</text>
								</g>
							)}
						</g>
					);
				})}
			</svg>

			{/* Legend */}
			<div className="mt-3 flex items-center gap-4 text-[10px] text-neutral-500">
				<div className="flex items-center gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
					Online
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
					Alert
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
					Offline
				</div>
			</div>
		</div>
	);
}
