"use client";

import { useState } from "react";
import type {
	DashboardOverview,
	DashboardActivityItem,
} from "@/lib/dashboard";
import { fetchWeather } from "./weather-card";

async function loadLogoBase64(): Promise<string | null> {
	try {
		const res = await fetch("/logo-2.png");
		if (!res.ok) return null;
		const blob = await res.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

interface Props {
	overview: DashboardOverview;
	activityFeed: DashboardActivityItem[];
}

export default function ExportReport({ overview, activityFeed }: Props) {
	const [generating, setGenerating] = useState(false);

	async function handleExport() {
		setGenerating(true);
		try {
			const [jsPDFModule, autoTableModule, weather, logoData] = await Promise.all([
				import("jspdf"),
				import("jspdf-autotable"),
				fetchWeather(),
				loadLogoBase64(),
			]);
			const jsPDF = jsPDFModule.default;
			const autoTable = autoTableModule.default;

			const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
			const pageWidth = doc.internal.pageSize.getWidth();
			let y = 20;

			// Logo + Title
			const textX = logoData ? 34 : 14;
			if (logoData) {
				doc.addImage(logoData, "PNG", 14, 12, 16, 16);
			}
			doc.setFontSize(18);
			doc.setFont("helvetica", "bold");
			doc.text("Chiliwap Dashboard Report", textX, y);
			y += 8;

			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(120);
			doc.text(`Generated: ${new Date().toLocaleString()}`, textX, y);
			doc.setTextColor(0);
			y += 12;

			// KPIs
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Key Performance Indicators", 14, y);
			y += 2;

			autoTable(doc, {
				startY: y,
				head: [["Metric", "Value", "Change", "Trend"]],
				body: overview.kpis.map((kpi) => [
					kpi.label,
					kpi.value,
					kpi.delta,
					kpi.trend,
				]),
				theme: "striped",
				headStyles: { fillColor: [40, 40, 40] },
				styles: { fontSize: 9 },
				margin: { left: 14, right: 14 },
			});
			y = (doc as any).lastAutoTable.finalY + 10;

			// Risk Trend
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Risk Trend", 14, y);
			y += 6;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			const riskStats = overview.riskTrend.stats;
			doc.text(`Timeframe: ${overview.riskTrend.timeframe}`, 14, y);
			y += 5;
			doc.text(`Peak: ${riskStats.peak}  |  Low: ${riskStats.low}  |  Delta: ${riskStats.delta > 0 ? "+" : ""}${riskStats.delta}`, 14, y);
			y += 5;
			if (overview.riskTrend.narrative) {
				const lines = doc.splitTextToSize(overview.riskTrend.narrative, pageWidth - 28);
				doc.text(lines, 14, y);
				y += lines.length * 4 + 4;
			}
			y += 4;

			// Water Usage
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Water Usage", 14, y);
			y += 6;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.text(`Today: ${overview.waterUsage.today}`, 14, y);
			y += 5;
			doc.text(`7-Day Avg: ${overview.waterUsage.sevenDayAvg}`, 14, y);
			y += 5;
			doc.text(`Projection: ${overview.waterUsage.projection}`, 14, y);
			y += 10;

			// Weather Conditions (fetched live)
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Weather Conditions", 14, y);
			y += 6;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			if (weather) {
				doc.text(`Temperature: ${weather.temperatureC.toFixed(1)}°C`, 14, y);
				y += 5;
				doc.text(`Humidity: ${weather.humidityPct}%`, 14, y);
				y += 5;
				doc.text(`Wind Speed: ${weather.windSpeedKmh.toFixed(1)} km/h`, 14, y);
				y += 5;
				doc.text(`Fire Danger: ${weather.fireDangerRating.toUpperCase()}`, 14, y);
				y += 5;
			} else {
				doc.text("Weather data unavailable (location access required).", 14, y);
				y += 5;
			}
			y += 6;

			// Check page overflow
			if (y > 240) {
				doc.addPage();
				y = 20;
			}

			// Activity Feed
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Recent Activity", 14, y);
			y += 2;

			if (activityFeed.length > 0) {
				autoTable(doc, {
					startY: y,
					head: [["Time", "Category", "Summary"]],
					body: activityFeed.map((ev) => [
						new Date(ev.timestamp).toISOString().slice(11, 16) + " UTC",
						ev.category,
						ev.summary,
					]),
					theme: "striped",
					headStyles: { fillColor: [40, 40, 40] },
					styles: { fontSize: 8, cellWidth: "wrap" },
					columnStyles: {
						0: { cellWidth: 25 },
						1: { cellWidth: 25 },
						2: { cellWidth: "auto" },
					},
					margin: { left: 14, right: 14 },
				});
				y = (doc as any).lastAutoTable.finalY + 10;
			} else {
				y += 6;
				doc.setFontSize(9);
				doc.setFont("helvetica", "normal");
				doc.text("No recent activity.", 14, y);
				y += 10;
			}

			// Alerts summary
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Alerts Summary", 14, y);
			y += 6;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.text(`Active: ${overview.alertsSummary.activeCount}`, 14, y);
			y += 5;
			const alertLines = doc.splitTextToSize(overview.alertsSummary.description, pageWidth - 28);
			doc.text(alertLines, 14, y);

			// Page numbers
			const totalPages = doc.getNumberOfPages();
			for (let i = 1; i <= totalPages; i++) {
				doc.setPage(i);
				doc.setFontSize(8);
				doc.setTextColor(150);
				doc.text(
					`Page ${i} of ${totalPages}`,
					pageWidth / 2,
					doc.internal.pageSize.getHeight() - 10,
					{ align: "center" },
				);
			}

			const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
			doc.save(`chiliwap-dashboard-${timestamp}.pdf`);
		} catch (err) {
			console.error("PDF export failed:", err);
		} finally {
			setGenerating(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleExport}
			disabled={generating}
			className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition text-[11px] font-medium disabled:opacity-50"
		>
			{generating ? (
				<svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M12 2v4m0 12v4m-7.07-3.93 2.83-2.83m8.48-8.48 2.83-2.83M2 12h4m12 0h4m-3.93 7.07-2.83-2.83M7.76 7.76 4.93 4.93" />
				</svg>
			) : (
				<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
			)}
			{generating ? "Generating..." : "Export Report"}
		</button>
	);
}
