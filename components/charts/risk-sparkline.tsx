"use client";

import { AreaChart } from "@tremor/react";
import type { CustomTooltipProps } from "@tremor/react";

type SparklinePoint = {
	timestamp: number;
	value: number;
};

type RiskSparklineProps = {
	series: SparklinePoint[];
	className?: string;
	narrative?: string;
};

const valueFormatter = (value: number) => `${value.toFixed(0)}`;

function formatTimestamp(timestamp: number) {
	return new Date(timestamp).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function RiskSparkline({
	series,
	className,
	narrative,
}: RiskSparklineProps) {
	if (!series || series.length < 2) {
		return (
			<div className="h-full grid place-items-center text-neutral-500 text-xs tracking-wide px-6 text-center">
				<span className="opacity-70 leading-relaxed">
					{narrative ??
						"Connect your controllers to populate the sparkline with live risk scores."}
				</span>
			</div>
		);
	}

	const data = [...series]
		.sort((a, b) => a.timestamp - b.timestamp)
		.map((point) => ({
			time: formatTimestamp(point.timestamp),
			"Risk Index": point.value,
		}));

	const SparklineTooltip = ({ payload, active, label }: CustomTooltipProps) => {
		if (!active || !payload?.length) {
			return null;
		}

		return (
			<div className="rounded-lg border border-white/10 bg-neutral-900/95 px-3 py-2 shadow-lg backdrop-blur">
				<p className="text-[10px] uppercase tracking-wide text-white">
					{label}
				</p>
				{payload.map((item, idx) => {
					const numericValue =
						typeof item.value === "number"
							? item.value
							: Number.parseFloat(String(item.value));

					return (
						<p
							key={`${item.dataKey ?? "value"}-${idx}`}
							className="mt-1 text-sm font-semibold text-white"
						>
							{item.dataKey}:{" "}
							{Number.isFinite(numericValue)
								? valueFormatter(numericValue)
								: item.value}
						</p>
					);
				})}
			</div>
		);
	};

	const composedClassName = [
		"h-full w-full",
		"text-white",
		"[&_.recharts-cartesian-axis-tick-value]:fill-white",
		"[&_.recharts-cartesian-axis-tick-value]:text-white",
		"[&_.recharts-cartesian-axis-tick-value>tspan]:fill-white",
		"[&_.recharts-cartesian-axis-tick-value>tspan::selection]:fill-white",
		"[&_.recharts-xAxis_.recharts-label]:fill-white",
		"[&_.recharts-yAxis_.recharts-label]:fill-white",
		"[&_.recharts-legend-item-text]:text-white",
		"[&_.recharts-legend-item-text]:fill-white",
		"[&_.recharts-default-tooltip]:bg-neutral-900/90",
		"[&_.recharts-default-tooltip]:border border-white/10",
		"[&_.recharts-tooltip-label]:text-white",
		"[&_.recharts-tooltip-item]:text-white",
		"[&_.recharts-area-curve]:stroke-[#fb7185]",
		"[&_.recharts-area-curve]:stroke-[3px]",
		"[&_.recharts-area-curve]:drop-shadow-[0_0_12px_rgba(251,113,133,0.55)]",
		"[&_.recharts-area-curve]:opacity-100",
		"[&_.recharts-area-dots>circle]:fill-[#fecdd3]",
		"[&_.recharts-area-area]:[fill-opacity:0.9]",
		"[&_linearGradient>stop:first-of-type]:[stop-color:#be123c]",
		"[&_linearGradient>stop:first-of-type]:[stop-opacity:0.85]",
		"[&_linearGradient>stop:last-of-type]:[stop-color:#4c0519]",
		"[&_linearGradient>stop:last-of-type]:[stop-opacity:0.18]",
		className ?? "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<AreaChart
			className={composedClassName}
			data={data}
			index="time"
			categories={["Risk Index"]}
			colors={["rose"]}
			valueFormatter={valueFormatter}
			customTooltip={SparklineTooltip}
			showLegend={false}
			showYAxis={false}
			showGridLines={false}
			startEndOnly
			connectNulls
			curveType="monotone"
			showGradient
		/>
	);
}
