"use client";

import { useState } from "react";

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

interface Invoice {
	id: string;
	number: string;
	amount: number;
	currency: string;
	status: string;
	createdAt: string;
}

interface Props {
	planName: string;
	invoices: Invoice[];
	defaultCard: string;
}

export default function ExportAnnualSummary({
	planName,
	invoices,
	defaultCard,
}: Props) {
	const [generating, setGenerating] = useState(false);

	async function handleExport() {
		setGenerating(true);
		try {
			const [jsPDFModule, autoTableModule, logoData] = await Promise.all([
				import("jspdf"),
				import("jspdf-autotable"),
				loadLogoBase64(),
			]);
			const jsPDF = jsPDFModule.default;
			const autoTable = autoTableModule.default;

			const doc = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});
			const pageWidth = doc.internal.pageSize.getWidth();
			const now = new Date();
			const year = now.getFullYear();
			let y = 20;

			// Logo + Title
			const textX = logoData ? 34 : 14;
			if (logoData) {
				doc.addImage(logoData, "PNG", 14, 12, 16, 16);
			}
			doc.setFontSize(18);
			doc.setFont("helvetica", "bold");
			doc.text(`Chiliwap Annual Billing Summary`, textX, y);
			y += 7;
			doc.setFontSize(13);
			doc.text(`${year}`, textX, y);
			y += 7;

			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(120);
			doc.text(`Generated: ${now.toLocaleString()}`, textX, y);
			doc.setTextColor(0);
			y += 10;

			// Account overview
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Account Overview", 14, y);
			y += 7;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.text(`Plan: ${planName}`, 14, y);
			y += 5;
			doc.text(`Default Payment: ${defaultCard}`, 14, y);
			y += 5;
			doc.text(`Statement Period: Jan 1 — Dec 31, ${year}`, 14, y);
			y += 12;

			// Compute totals
			const paidInvoices = invoices.filter((inv) => inv.status === "paid");
			const totalCents = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
			const currency = paidInvoices[0]?.currency || "usd";
			const fmt = (cents: number) =>
				new Intl.NumberFormat(undefined, {
					style: "currency",
					currency,
				}).format(cents / 100);

			// Summary stats
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Summary", 14, y);
			y += 7;
			doc.setFontSize(9);
			doc.setFont("helvetica", "normal");
			doc.text(`Total Invoices: ${invoices.length}`, 14, y);
			y += 5;
			doc.text(`Paid: ${paidInvoices.length}`, 14, y);
			y += 5;
			doc.text(`Total Billed: ${fmt(totalCents)}`, 14, y);
			y += 5;
			if (paidInvoices.length > 0) {
				doc.text(
					`Average per Invoice: ${fmt(Math.round(totalCents / paidInvoices.length))}`,
					14,
					y,
				);
				y += 5;
			}
			y += 8;

			// Invoices table
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text("Invoice History", 14, y);
			y += 2;

			if (invoices.length > 0) {
				autoTable(doc, {
					startY: y,
					head: [["Date", "Invoice #", "Amount", "Status"]],
					body: invoices.map((inv) => {
						const d = new Date(inv.createdAt);
						return [
							d.toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
								year: "numeric",
							}),
							inv.number,
							fmt(inv.amount),
							inv.status,
						];
					}),
					theme: "striped",
					headStyles: { fillColor: [40, 40, 40] },
					styles: { fontSize: 9 },
					margin: { left: 14, right: 14 },
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				y = (doc as any).lastAutoTable.finalY + 10;
			} else {
				y += 6;
				doc.setFontSize(9);
				doc.setFont("helvetica", "normal");
				doc.text("No invoices for this period.", 14, y);
				y += 10;
			}

			// Totals row
			doc.setFontSize(10);
			doc.setFont("helvetica", "bold");
			doc.text(`Total: ${fmt(totalCents)}`, pageWidth - 14, y, {
				align: "right",
			});
			y += 12;

			// Footer note
			doc.setFontSize(8);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(120);
			const note =
				"This summary is for informational purposes only and is not a tax document. Payment methods are tokenized; full card numbers are never stored. Contact support for invoice disputes or VAT/GST adjustments.";
			const noteLines = doc.splitTextToSize(note, pageWidth - 28);
			doc.text(noteLines, 14, y);

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

			const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
			doc.save(`chiliwap-annual-summary-${year}-${timestamp}.pdf`);
		} catch (err) {
			console.error("Annual summary export failed:", err);
		} finally {
			setGenerating(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleExport}
			disabled={generating}
			className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 px-4 py-2 transition disabled:opacity-50"
		>
			{generating ? (
				<svg
					className="h-3.5 w-3.5 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M12 2v4m0 12v4m-7.07-3.93 2.83-2.83m8.48-8.48 2.83-2.83M2 12h4m12 0h4m-3.93 7.07-2.83-2.83M7.76 7.76 4.93 4.93" />
				</svg>
			) : (
				<svg
					className="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
					<polyline points="14 2 14 8 20 8" />
					<line x1="16" y1="13" x2="8" y2="13" />
					<line x1="16" y1="17" x2="8" y2="17" />
					<polyline points="10 9 9 9 8 9" />
				</svg>
			)}
			{generating ? "Generating..." : "Generate Annual Summary"}
		</button>
	);
}
