"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { FireDangerRating, WeatherConditions } from "@/lib/dashboard";

function computeFireDanger(
	tempC: number,
	humidityPct: number,
	windKmh: number,
): FireDangerRating {
	const score =
		(tempC > 35 ? 3 : tempC > 30 ? 2 : tempC > 25 ? 1 : 0) +
		(humidityPct < 15 ? 3 : humidityPct < 25 ? 2 : humidityPct < 40 ? 1 : 0) +
		(windKmh > 50 ? 3 : windKmh > 30 ? 2 : windKmh > 15 ? 1 : 0);

	if (score >= 8) return "catastrophic";
	if (score >= 6) return "extreme";
	if (score >= 4) return "high";
	if (score >= 2) return "moderate";
	return "low";
}

function dangerBadgeColor(rating: FireDangerRating) {
	switch (rating) {
		case "low":
			return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40";
		case "moderate":
			return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
		case "high":
			return "bg-amber-500/15 text-amber-200 ring-amber-500/30";
		case "extreme":
			return "bg-orange-500/15 text-orange-300 ring-orange-500/30";
		case "catastrophic":
			return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
	}
}

// Gradient tint based on conditions
function weatherGradient(w: WeatherConditions): string {
	const r = w.fireDangerRating;
	if (r === "catastrophic") return "from-rose-950/40 via-orange-950/20 to-transparent";
	if (r === "extreme") return "from-orange-950/30 via-amber-950/15 to-transparent";
	if (r === "high") return "from-amber-950/25 via-yellow-950/10 to-transparent";
	if (r === "moderate") return "from-sky-950/20 via-cyan-950/10 to-transparent";
	return "from-emerald-950/15 via-teal-950/5 to-transparent";
}

export async function fetchWeather(): Promise<WeatherConditions | null> {
	return new Promise((resolve) => {
		if (!("geolocation" in navigator)) {
			resolve(null);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				try {
					const { latitude, longitude } = pos.coords;
					const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
					const res = await fetch(url);
					if (!res.ok) {
						resolve(null);
						return;
					}
					const data = await res.json();
					const c = data.current;
					const tempC: number = c.temperature_2m;
					const humPct: number = c.relative_humidity_2m;
					const windKmh: number = c.wind_speed_10m;
					resolve({
						temperatureC: tempC,
						humidityPct: humPct,
						windSpeedKmh: windKmh,
						fireDangerRating: computeFireDanger(tempC, humPct, windKmh),
						lastUpdated: new Date().toISOString(),
					});
				} catch {
					resolve(null);
				}
			},
			() => resolve(null),
			{ timeout: 10000, maximumAge: 300000 },
		);
	});
}

// Animated SVG background layer
function WeatherScene({ weather }: { weather: WeatherConditions }) {
	const isHot = weather.temperatureC > 28;
	const isWindy = weather.windSpeedKmh > 15;
	const isDry = weather.humidityPct < 30;

	return (
		<svg
			className="absolute inset-0 w-full h-full"
			viewBox="0 0 800 200"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			<defs>
				{/* Heat shimmer */}
				{isHot && (
					<filter id="heat-shimmer">
						<feTurbulence
							type="turbulence"
							baseFrequency="0.015 0.04"
							numOctaves="2"
							seed="3"
						>
							<animate
								attributeName="baseFrequency"
								values="0.015 0.04;0.02 0.06;0.015 0.04"
								dur="8s"
								repeatCount="indefinite"
							/>
						</feTurbulence>
						<feDisplacementMap
							in="SourceGraphic"
							scale="3"
						/>
					</filter>
				)}
			</defs>

			{/* Floating heat particles when hot + dry */}
			{isHot && isDry && (
				<g opacity="0.15">
					{Array.from({ length: 8 }).map((_, i) => (
						<circle
							key={`heat-${i}`}
							r={1 + (i % 3)}
							fill={i % 2 === 0 ? "#f97316" : "#fbbf24"}
						>
							<animateMotion
								dur={`${6 + i * 1.3}s`}
								repeatCount="indefinite"
								path={`M${80 + i * 90},200 Q${100 + i * 80},${80 - i * 8} ${160 + i * 90},${-20 - i * 5}`}
							/>
							<animate
								attributeName="opacity"
								values="0;0.5;0"
								dur={`${6 + i * 1.3}s`}
								repeatCount="indefinite"
							/>
						</circle>
					))}
				</g>
			)}

			{/* Wind streaks */}
			{isWindy && (
				<g opacity="0.08">
					{Array.from({ length: 6 }).map((_, i) => (
						<line
							key={`wind-${i}`}
							y1={30 + i * 28}
							y2={30 + i * 28}
							stroke="white"
							strokeWidth={0.5 + (i % 3) * 0.3}
							strokeLinecap="round"
						>
							<animate
								attributeName="x1"
								values={`${-100 - i * 40};900`}
								dur={`${2.5 + i * 0.6}s`}
								repeatCount="indefinite"
							/>
							<animate
								attributeName="x2"
								values={`${-60 - i * 40};940`}
								dur={`${2.5 + i * 0.6}s`}
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0;0.4;0.4;0"
								dur={`${2.5 + i * 0.6}s`}
								repeatCount="indefinite"
							/>
						</line>
					))}
				</g>
			)}

			{/* Gentle ambient dots — always visible */}
			<g opacity="0.04">
				{Array.from({ length: 12 }).map((_, i) => (
					<circle
						key={`dot-${i}`}
						r={1 + (i % 2)}
						fill="white"
					>
						<animateMotion
							dur={`${10 + i * 2}s`}
							repeatCount="indefinite"
							path={`M${i * 70},${180 + (i % 3) * 10} Q${400},${60 + i * 5} ${800 - i * 30},${170 - (i % 4) * 15}`}
						/>
						<animate
							attributeName="opacity"
							values="0;1;0"
							dur={`${10 + i * 2}s`}
							repeatCount="indefinite"
						/>
					</circle>
				))}
			</g>

			{/* Heat shimmer overlay bar at bottom */}
			{isHot && (
				<rect
					x="0"
					y="160"
					width="800"
					height="40"
					fill="none"
					filter="url(#heat-shimmer)"
				/>
			)}
		</svg>
	);
}

interface WeatherHeaderProps {
	children: ReactNode;
}

export default function WeatherHeader({ children }: WeatherHeaderProps) {
	const [weather, setWeather] = useState<WeatherConditions | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		fetchWeather().then((w) => {
			setWeather(w);
			setLoaded(true);
		});
	}, []);

	return (
		<header className="relative border-b border-white/5 overflow-hidden">
			{/* Animated weather background */}
			{weather && (
				<>
					<div
						className={`absolute inset-0 bg-gradient-to-b ${weatherGradient(weather)} transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
					/>
					<WeatherScene weather={weather} />
				</>
			)}

			{/* Header content — passed through */}
			<div className="relative z-10">
				{children}
			</div>

			{/* Weather stats strip at bottom of header */}
			{loaded && (
				<div className={`relative z-10 transition-all duration-700 ${weather ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
					{weather ? (
						<div className="max-w-7xl mx-auto px-6 pb-4">
							<div className="flex items-center gap-5 text-[11px]">
								<div className="flex items-center gap-1.5 text-neutral-400">
									<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 2a2 2 0 0 0-2 2v9.17a3.001 3.001 0 1 0 4 0V4a2 2 0 0 0-2-2Z" />
									</svg>
									<span className="text-neutral-200 font-medium tabular-nums">{weather.temperatureC.toFixed(1)}°C</span>
								</div>
								<div className="flex items-center gap-1.5 text-neutral-400">
									<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 2.5c-1.2 2.4-5 6.3-5 9.5a5 5 0 0 0 10 0c0-3.2-3.8-7.1-5-9.5Z" />
									</svg>
									<span className="text-neutral-200 font-medium tabular-nums">{weather.humidityPct}%</span>
								</div>
								<div className="flex items-center gap-1.5 text-neutral-400">
									<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
										<path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
										<path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
									</svg>
									<span className="text-neutral-200 font-medium tabular-nums">{weather.windSpeedKmh.toFixed(1)} km/h</span>
								</div>
								<span
									className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${dangerBadgeColor(weather.fireDangerRating)}`}
								>
									{weather.fireDangerRating}
								</span>
								<span className="ml-auto text-[10px] text-neutral-600 hidden sm:inline">
									Live via Open-Meteo
								</span>
							</div>
						</div>
					) : (
						<div className="max-w-7xl mx-auto px-6 pb-4">
							<p className="text-[10px] text-neutral-600">
								Allow location access for live weather
							</p>
						</div>
					)}
				</div>
			)}
		</header>
	);
}
