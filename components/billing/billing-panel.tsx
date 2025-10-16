"use client";

import React, { useEffect } from "react";
import { cardBrands, type CardBrand } from "@/components/billing/card-brands";
import { generateMeshStyleFromSeed } from "@/lib/meshGradient";
import { Billing, Card } from "@/lib/auth";
import Modal from "../ui/modal";
import PaymentMethodForm from "../forms/payment-method-form";
import {
	submitMethodChange,
	deleteBillingMethod,
} from "../forms/actions/method";

function StarIcon({ filled = false }: { filled?: boolean }) {
	return filled ? (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
		</svg>
	) : (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			aria-hidden="true"
		>
			<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
		</svg>
	);
}

export default function BillingPanel(props: { billing: Billing | null }) {
	const { billing } = props;

	const [modalOpen, setModalOpen] = React.useState(false);
	// for tracking newly added method w/o query refresh
	const [addedMethod, setAddedMethod] = React.useState<Card | null>(null);

	const [cards, setCards] = React.useState<Card[] | []>(billing?.methods || []);
	const [defaultId, setDefaultId] = React.useState(
		billing?.defaultMethodId || ""
	);
	const [selectedId, setSelectedId] = React.useState(
		billing?.defaultMethodId || ""
	);

	const current = cards.find((c) => c.id === selectedId)!;
	const style = generateMeshStyleFromSeed(
		current ? current.details.last4 : "0001"
	);

	// When navigating directly to #billing anchor, visually highlight the payment methods box
	const [highlight, setHighlight] = React.useState(false);
	useEffect(() => {
		function maybeHighlightFromHash() {
			if (
				typeof window !== "undefined" &&
				window.location.hash === "#billing"
			) {
				setHighlight(true);
				// Auto clear after a short duration to avoid persistent distraction
				setTimeout(() => setHighlight(false), 4500);
			}
		}
		maybeHighlightFromHash();
		window.addEventListener("hashchange", maybeHighlightFromHash);
		return () =>
			window.removeEventListener("hashchange", maybeHighlightFromHash);
	}, []);

	useEffect(() => {
		if (addedMethod) {
			setCards((prev) => [addedMethod!, ...prev]);
			setDefaultId(addedMethod.id);
			setSelectedId(addedMethod.id);
		}
	}, [addedMethod]);

	return (
		<div>
			{/* Card Preview */}
			<div
				className="relative w-full h-48 mesh-gradient shadow-lg overflow-hidden rounded-2xl -mt-1 text-white"
				style={style}
			>
				<p className="absolute pointer-events-none top-5 right-3 bg-white/10 px-3 py-1 rounded-xl text-xs uppercase tracking-wide">
					Selected
				</p>
				<div>
					<div className="absolute top-4 left-5">
						{cardBrands[current?.details?.brand] ?? cardBrands.generic}
					</div>
					<header className="absolute top-16 left-6">
						<h3 className="text-2xl font-semibold">
							{current ? current.details.name : "John Doe"}
						</h3>
						<p className="text-base text-neutral-300">
							{current
								? current.details.address
								: "123 Main St, Anytown, Canada"}
						</p>
					</header>
					<p className="absolute text-lg monospace bottom-2 left-4">
						XXXX XXXX XXXX {current ? current.details.last4 : "XXXX"}
					</p>
					<p className="absolute text-sm monospace bottom-3 right-4">
						{!current ||
						(current.details.exp_month && current.details.exp_year == null)
							? "—"
							: `${current.details.exp_month
									.toString()
									.padStart(2, "0")}/${current.details.exp_year.toString()}`}
					</p>
				</div>
			</div>

			{/* Payment Methods: click row or star to set default (drives preview) */}
			<section className="mt-3">
				<div
					className={`relative rounded-2xl border bg-neutral-900/45 backdrop-blur-sm p-5 sm:p-6 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.05),0_2px_10px_-3px_rgba(0,0,0,0.5)] transition-colors duration-300 ${
						highlight
							? "border-amber-400/70 ring-2 ring-amber-400/70 shadow-[0_0_0_3px_rgba(251,191,36,0.25),0_0_28px_-4px_rgba(251,191,36,0.55)]"
							: "border-white/10"
					}`}
					onClick={() => highlight && setHighlight(false)}
					aria-live={highlight ? "polite" : undefined}
				>
					{highlight && (
						<span
							className="pointer-events-none absolute -inset-px rounded-2xl animate-pulse [background:radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.25),transparent_70%)]"
							aria-hidden="true"
						/>
					)}
					<h3 className="text-[11px] font-medium text-neutral-400 mb-3 uppercase tracking-wide">
						Payment methods
					</h3>
					<ul className="space-y-2 h-52 overflow-y-auto pr-1">
						{cards.map((c) => {
							const isDefault = c.id === defaultId;
							const isSelected = c.id === selectedId;
							return (
								<li
									key={c.id}
									role="button"
									aria-pressed={isSelected}
									onClick={() => setSelectedId(c.id)}
									className={`flex items-center justify-between px-2 py-1.5 rounded-md border transition-colors cursor-pointer ${
										isSelected
											? "border-white/25 bg-white/5"
											: "border-white/10 hover:border-white/20 hover:bg-white/5"
									}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<span className="shrink-0 inline-block [&_svg]:w-5 [&_svg]:h-5">
											{cardBrands[c.details.brand] ?? cardBrands.generic}
										</span>
										<div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
											<span className="uppercase tracking-wide text-[11px] text-neutral-400">
												{c.details.brand}
											</span>
											<span className="text-sm text-neutral-200">
												•••• {c.details.last4}
											</span>
											{isDefault && (
												<span className="text-[10px] rounded-full bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 border border-emerald-500/30">
													Default
												</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-1.5">
										<button
											onClick={(e) => {
												e.stopPropagation();
												setDefaultId(c.id);
											}}
											className={`cursor-pointer inline-flex items-center p-1 rounded-md transition-colors ${
												isDefault
													? "text-amber-400 bg-amber-400/15"
													: "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
											}`}
											title={isDefault ? "Default" : "Set default"}
											aria-pressed={isDefault}
										>
											<StarIcon filled={isDefault} />
											<span className="sr-only">
												{isDefault ? "Default" : "Set default"}
											</span>
										</button>
										<button
											onClick={async (e) => {
												e.stopPropagation();
												const prev = cards;
												setCards((p) => p.filter((m) => m.id !== c.id));
												if (defaultId === c.id) {
													const remaining = cards.filter((m) => m.id !== c.id);
													setDefaultId(remaining[0]?.id || "");
													setSelectedId(remaining[0]?.id || "");
												}
												const res = await deleteBillingMethod(c.id);
												if (!res.ok) {
													setCards(prev);
													console.error(res.error);
												}
											}}
											className="cursor-pointer inline-flex items-center p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
											title="Remove"
											aria-label="Remove"
										>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												aria-hidden="true"
											>
												<path d="M3 6h18M9 6V4h6v2m-7 4v9m4-9v9m4-9v9" />
											</svg>
										</button>
									</div>
								</li>
							);
						})}
						{cards.length === 0 && (
							<li className="text-sm text-neutral-500 text-center py-4">
								No payment methods available.
							</li>
						)}
					</ul>
					<button
						onClick={() => setModalOpen(true)}
						className="cursor-pointer mt-4 w-full py-2.5 bg-white text-neutral-900 rounded-md font-medium text-sm hover:bg-white/90 transition"
					>
						Add Payment Method
					</button>
				</div>
			</section>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<h2 className="text-xl font-semibold mb-4 text-center text-white">
					Add Payment Method
				</h2>
				<PaymentMethodForm
					setOpenState={setModalOpen}
					action={submitMethodChange}
					setAddedMethod={setAddedMethod}
				/>
			</Modal>
		</div>
	);
}
