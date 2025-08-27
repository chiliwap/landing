"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/modal";
const ContactForm = dynamic(() => import("@/components/forms/contact-form"), {
	ssr: false,
});
import { submitContact } from "@/components/forms/actions/contact";

type TierFeatures = {
	sprinklersSystem?: string; // description of sprinklers/system
	radius?: string; // coverage radius / area
	activation?: string; // activation type
	zones?: string; // zone control details
	soakerSpacing?: string | boolean; // spacing for under-soffit sprinklers
	watermainTieIn: boolean;
	trainingBinder: boolean;
	firesmartInspection: boolean;
	permitting: boolean;
	storage?: string | boolean; // storage capacity description
	pumpBackup?: string | boolean; // pump / backup
	dischargePurify?: string | boolean; // purification/discharge
	irrigation?: boolean; // lawn and landscape irrigation
	generatorBackup?: boolean; // generator backup power
	downpipeReroute?: boolean; // rerouting downpipes to tank
	secondarySupply?: boolean; // secondary supply connection
	warranty: string; // warranty text
};

type Tier = {
	id: string;
	name: string;
	description: string;
	popular?: boolean;
	price: string; // e.g. "$5,100" or "Call for price"
	bullets: string[]; // short highlights for card view
	features: TierFeatures;
	cta?: string;
};

const pricingTiers: Tier[] = [
	{
		id: "impact",
		name: "Barebones",
		description: "High-range impact sprinklers",
		price: "$5,100",
		bullets: [
			"2 brass impact sprinklers",
			"Up to 15.25 m radius",
			"Timer activation",
			"2-zone control",
		],
		features: {
			sprinklersSystem: "2 high-range brass impact sprinklers",
			radius: "Up to 15.25 m radius (depends on pressure)",
			activation: "Easy set timer activation",
			zones: "2-zone control",
			soakerSpacing: false,
			watermainTieIn: false,
			trainingBinder: false,
			firesmartInspection: false,
			permitting: false,
			storage: false,
			pumpBackup: false,
			dischargePurify: false,
			irrigation: false,
			generatorBackup: false,
			downpipeReroute: false,
			secondarySupply: false,
			warranty: "—",
		},
		cta: "Request estimate",
	},
	{
		id: "soaking",
		name: "Home",
		description: "Whole-home soaking system",
		price: "$15,000",
		popular: true,
		bullets: [
			"Remote activation (internet + satellite)",
			"Heads every 3 m with overlap",
			"Watermain tie-in",
			"3-year warranty",
		],
		features: {
			sprinklersSystem: "Under-soffit soaking system",
			radius: "10 m+ surrounding area",
			activation: "Remote via internet & satellite",
			zones: "Multi-zone under-soffit",
			soakerSpacing: "Sprinkler heads every 3 m with overlap",
			watermainTieIn: true,
			trainingBinder: true,
			firesmartInspection: true,
			permitting: true,
			storage: false,
			pumpBackup: false,
			dischargePurify: false,
			irrigation: false,
			generatorBackup: false,
			downpipeReroute: false,
			secondarySupply: false,
			warranty: "3 Year",
		},
		cta: "Book installation",
	},
	{
		id: "prepared",
		name: "Deluxe",
		description: "Advanced storage and power",
		price: "$25,800",
		bullets: [
			"3,785 L storage tank (optional 9,500 L in-ground)",
			"SmartPump + battery backup",
			"SmartWater discharge",
			"Irrigation & generator backup",
			"4-year warranty",
		],
		features: {
			sprinklersSystem: "Home Soaking System + storage",
			radius: "10 m+ surrounding area",
			activation: "Remote via internet & satellite",
			zones: "Multi-zone under-soffit",
			soakerSpacing: "Sprinkler heads every 3 m with overlap",
			watermainTieIn: true,
			trainingBinder: true,
			firesmartInspection: true,
			permitting: true,
			storage: "3,785 L above-ground tank (std) or 9,500 L in-ground optional",
			pumpBackup: "SmartPump with battery backup",
			dischargePurify: "SmartWater discharge to purify and slow release",
			irrigation: true,
			generatorBackup: true,
			downpipeReroute: true,
			secondarySupply: true,
			warranty: "4 Year",
		},
		cta: "Talk to team",
	},
];

const featureCategories = [
	{
		name: "System & Coverage",
		features: [
			{ key: "sprinklersSystem", label: "Sprinklers / System" },
			{ key: "radius", label: "Coverage / Radius" },
			{ key: "activation", label: "Activation" },
			{ key: "zones", label: "Zones" },
		],
	},
	{
		name: "Soaking & Setup",
		features: [
			{ key: "soakerSpacing", label: "Sprinkler spacing" },
			{ key: "watermainTieIn", label: "Watermain tie-in" },
			{ key: "trainingBinder", label: "Operation binder & demos" },
			{ key: "firesmartInspection", label: "FireSmart inspection" },
			{ key: "permitting", label: "Permitting included" },
		],
	},
	{
		name: "Storage & Power",
		features: [
			{ key: "storage", label: "Rainwater storage" },
			{ key: "pumpBackup", label: "Pump & backup" },
			{ key: "dischargePurify", label: "Water purification/discharge" },
			{ key: "irrigation", label: "Lawn & landscape irrigation" },
			{ key: "generatorBackup", label: "Generator backup" },
			{ key: "downpipeReroute", label: "Re-route downpipes" },
			{ key: "secondarySupply", label: "Secondary supply to home" },
			{ key: "warranty", label: "Warranty" },
		],
	},
];

function CheckIcon() {
	return (
		<svg
			className="w-4 h-4 text-emerald-400 justify-self-center"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

function XIcon() {
	return (
		<svg
			className="w-4 h-4 text-neutral-600 justify-self-center"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				fillRule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export default function Pricing() {
	const [hoveredTier, setHoveredTier] = useState<string | null>(null);
	const [selectedPlanId, setSelectedPlanId] = useState<string>(
		pricingTiers.find((t) => t.popular)?.id || pricingTiers[0].id
	);
	const selectedTier = useMemo(
		() => pricingTiers.find((t) => t.id === selectedPlanId)!,
		[selectedPlanId]
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTier, setModalTier] = useState<Tier | null>(null);

	return (
		<section className="text-white py-24 px-6">
			<div className="max-w-7xl mx-auto">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.48, 0.15, 0.25, 0.96] }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-6xl font-semibold mb-3 tracking-tight">
						Pricing
					</h2>
					<p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
						Wildfire protection systems tailored to your property and risk.
					</p>
				</motion.div>

				{/* Pricing Cards - Sleek glass panels */}
				<div id="pricing" className="relative mb-16">
					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
						{pricingTiers.map((tier, index) => (
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.08, duration: 0.55 }}
								key={tier.id}
								className="block cursor-default"
							>
								<motion.div
									onMouseEnter={() => setHoveredTier(tier.id)}
									onMouseLeave={() => setHoveredTier(null)}
									className={`relative h-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/20 p-6 backdrop-blur-md transition-all duration-300 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)] ${
										tier.popular ? "lg:scale-[1.02]" : ""
									}`}
								>
									{/* Glow */}
									<div
										className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${
											tier.popular
												? "bg-[radial-gradient(600px_200px_at_50%_-20%,rgba(255,115,0,0.25),transparent)]"
												: "bg-[radial-gradient(500px_160px_at_50%_-20%,rgba(255,255,255,0.15),transparent)]"
										} ${
											hoveredTier === tier.id ? "opacity-100" : "opacity-60"
										}`}
									/>

									{/* Header */}
									<div className="relative z-10 mb-4 flex items-center justify-between">
										<div>
											<h3 className="text-lg font-semibold">{tier.name}</h3>
											<p className="mt-1 text-sm text-neutral-400">
												{tier.description}
											</p>
										</div>
										{tier.popular && (
											<span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/90 ring-1 ring-white/15">
												POPULAR
											</span>
										)}
									</div>

									{/* Price */}
									<div className="relative z-10 mb-5">
										<span className="text-neutral-500 text-lg mr-2">from</span>
										<span className="text-4xl font-semibold leading-none">
											{tier.price}
										</span>
									</div>

									{/* CTA */}
									<button
										type="button"
										className="cursor-pointer block text-center z-10 mb-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-95"
										onClick={() => {
											setModalTier(tier);
											setModalOpen(true);
										}}
									>
										{tier.cta ?? "Request estimate"}
									</button>

									{/* Features */}
									<ul className="relative z-10 space-y-2 text-sm">
										{tier.bullets.map((line, i) => (
											<li key={i} className="flex items-start gap-2">
												<CheckIcon />
												<span className="text-neutral-300">{line}</span>
											</li>
										))}
									</ul>
								</motion.div>
							</motion.div>
						))}
					</div>
				</div>
				{/* Mobile: Plan Tabs + 2-col feature list */}
				<div className="md:hidden">
					{/* Tabs under nav: sticky so it stays visible */}
					<div className="sticky top-18 z-10 -mx-6 px-6 py-3 bg-[color:var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/60">
						<div className="flex gap-2 overflow-x-auto no-scrollbar">
							{pricingTiers.map((tier) => {
								const active = tier.id === selectedPlanId;
								return (
									<button
										key={tier.id}
										onClick={() => setSelectedPlanId(tier.id)}
										className={
											"cursor-pointer whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-colors " +
											(active
												? "bg-white text-black border-white"
												: "border-neutral-800 text-neutral-300 hover:border-neutral-700")
										}
									>
										{tier.name}
									</button>
								);
							})}
						</div>
					</div>

					{/* 2-col table for selected plan */}
					<div className="mt-4 bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
						{featureCategories.map((category) => (
							<div key={category.name}>
								<div className="px-4 py-3 bg-neutral-900/40 border-b border-neutral-800">
									<h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
										{category.name}
									</h4>
								</div>
								<div className="divide-y divide-neutral-800">
									{category.features.map((feature) => {
										const value =
											selectedTier.features[
												feature.key as keyof typeof selectedTier.features
											];
										const isBool = typeof value === "boolean";
										return (
											<div
												key={feature.key}
												className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3"
											>
												<span className="text-sm text-neutral-300">
													{feature.label}
												</span>
												<span className="justify-self-end">
													{isBool ? (
														value ? (
															<CheckIcon />
														) : (
															<XIcon />
														)
													) : (
														<span className="text-sm text-white">
															{(value as string) || "—"}
														</span>
													)}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Desktop/Tablet: Feature Comparison Table */}
				<div className="hidden md:block overflow-x-auto -mx-6 px-6 overflow-hidden">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							delay: 0.2,
							duration: 0.6,
							ease: [0.48, 0.15, 0.25, 0.96],
						}}
						className="min-w-[900px] bg-neutral-950/40 border border-neutral-800 rounded-2xl overflow-hidden"
					>
						{/* Table Header */}
						<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
							<div className="text-sm md:text-base font-medium text-neutral-300">
								Features
							</div>
							{pricingTiers.map((tier) => (
								<div key={tier.id} className="text-center">
									<div className="text-sm md:text-base font-semibold text-white">
										{tier.name}
									</div>
									<div className="text-xs md:text-sm text-neutral-400 mt-1">
										{tier.price}
									</div>
								</div>
							))}
						</div>

						{/* Feature Categories */}
						{featureCategories.map((category, categoryIndex) => (
							<div key={category.name}>
								{/* Category Header */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
									className="px-6 py-4 bg-neutral-900/40 border-b border-neutral-800"
								>
									<h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
										{category.name}
									</h4>
								</motion.div>

								{/* Features */}
								{category.features.map((feature, featureIndex) => (
									<motion.div
										key={feature.key}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{
											delay: categoryIndex * 0.1 + featureIndex * 0.05,
											duration: 0.5,
										}}
										className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-6 py-3 border-b border-neutral-800/60 hover:bg-neutral-900/30 transition-colors"
									>
										<div className="text-neutral-300 text-sm">
											{feature.label}
										</div>
										{pricingTiers.map((tier) => {
											const value =
												tier.features[
													feature.key as keyof typeof tier.features
												];
											const isBool = typeof value === "boolean";
											return (
												<div key={tier.id} className="text-center">
													{isBool ? (
														value ? (
															<CheckIcon />
														) : (
															<XIcon />
														)
													) : (
														<span className="text-white text-sm">
															{(value as string) || "—"}
														</span>
													)}
												</div>
											);
										})}
									</motion.div>
								))}
							</div>
						))}
					</motion.div>
				</div>
				{/* Short note about estimates */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="mx-auto max-w-3xl text-center text-neutral-400"
				>
					<p className="text-xs md:text-sm mt-2">
						Estimates for ~2000 sq ft homes; final pricing varies by site.
					</p>
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{
						delay: 0.6,
						duration: 0.6,
						ease: [0.48, 0.15, 0.25, 0.96],
					}}
					className="text-center mt-16"
				>
					<p className="text-neutral-400 mb-8">
						Need a custom solution? Our team can design a fire protection system
						tailored to your specific requirements.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/products"
							className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
							aria-label="Schedule a free consultation"
						>
							Schedule Free Consultation
						</Link>

						<button
							type="button"
							className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/25"
							aria-label="Contact our sales team"
							onClick={() => setModalOpen(true)}
						>
							Contact Sales Team
						</button>
					</div>
				</motion.div>
			</div>
			{/* Contact Modal */}
			<Modal
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
					setModalTier(null);
				}}
			>
				<h2 className="text-xl font-semibold mb-4 text-center">Contact</h2>
				<ContactForm
					action={submitContact}
					selectedTier={modalTier?.name ?? "No Tier Selected"}
				/>
			</Modal>
		</section>
	);
}
