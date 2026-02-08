"use client";

import { ProgressCircle, Text, Title } from "@tremor/react";

type ChartProps = {
	className?: string;
};

type WaterUsageGaugeProps = ChartProps & {
	ratio: number | null;
};

const FALLBACK_MESSAGE =
	"Not enough usage data yet. Once telemetry reports daily draw and seven-day averages, a load gauge will appear here.";

function clampRatio(value: number) {
	return Math.min(Math.max(value, 0), 1);
}

export default function WaterUsageGauge({
	ratio,
	className,
}: WaterUsageGaugeProps) {
	if (ratio === null || Number.isNaN(ratio)) {
		return <WaterUsageGaugeFallback className={className} />;
	}

	const clampedRatio = clampRatio(ratio);
	const percent = Math.round(clampedRatio * 100);

	return (
		<div
			className={
				className ?? "flex h-full flex-col items-center justify-center gap-3"
			}
		>
			<Text className="text-xs uppercase tracking-wide text-emerald-200">
				Water Usage
			</Text>
			<div className="relative flex items-center justify-center">
				<ProgressCircle value={clampedRatio * 100} color="emerald">
					<Title className="text-3xl font-semibold text-white">
						{percent}%
					</Title>
				</ProgressCircle>
			</div>
			<Text className="text-xs text-emerald-200/80">vs. Facility Average</Text>
		</div>
	);
}

export const WaterUsageGaugeFallback = ({ className }: ChartProps) => (
	<div
		className={
			className ??
			"flex h-full flex-col items-center justify-center gap-3 text-center text-slate-300"
		}
	>
		<Text className="text-xs uppercase tracking-wide text-slate-200">
			Water Usage
		</Text>
		<div className="text-2xl font-semibold text-slate-100">–%</div>
		<Text className="text-xs leading-relaxed text-slate-400">
			{FALLBACK_MESSAGE}
		</Text>
	</div>
);
