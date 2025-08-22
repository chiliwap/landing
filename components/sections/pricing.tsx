"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const pricingTiers = [
  {
    id: "basic",
    name: "Basic Protection",
    price: "$2,499",
    period: "from",
    description:
      "Essential fire protection for small properties and residential homes",
    popular: false,
    features: {
      coverage: "Up to 1,000 sq ft",
      sprinklers: "4-6 sprinkler heads",
      installation: true,
      maintenance: "Annual inspection",
      emergency: false,
      monitoring: false,
      compliance: "Basic reporting",
      warranty: "2 years",
      support: "Business hours",
      customization: false,
      priority: false,
    },
    buttonText: "Get Started",
    buttonStyle:
      "border border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800/50",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$4,999",
    period: "from",
    description:
      "Comprehensive protection for commercial properties and larger homes",
    popular: true,
    features: {
      coverage: "Up to 5,000 sq ft",
      sprinklers: "12-20 sprinkler heads",
      installation: true,
      maintenance: "Bi-annual inspection",
      emergency: true,
      monitoring: "24/7 monitoring",
      compliance: "Full compliance reporting",
      warranty: "5 years",
      support: "24/7 support",
      customization: true,
      priority: true,
    },
    buttonText: "Most Popular",
    buttonStyle:
      "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description:
      "Advanced solutions for large commercial facilities and industrial complexes",
    popular: false,
    features: {
      coverage: "Unlimited coverage",
      sprinklers: "Unlimited sprinklers",
      installation: true,
      maintenance: "Quarterly inspection",
      emergency: true,
      monitoring: "Advanced monitoring",
      compliance: "Premium compliance suite",
      warranty: "10 years",
      support: "Dedicated support team",
      customization: true,
      priority: true,
    },
    buttonText: "Contact Sales",
    buttonStyle:
      "border border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800/50",
  },
];

const featureCategories = [
  {
    name: "Coverage & Installation",
    features: [
      { key: "coverage", label: "Coverage Area" },
      { key: "sprinklers", label: "Sprinkler Heads Included" },
      { key: "installation", label: "Professional Installation" },
      { key: "customization", label: "Custom System Design" },
    ],
  },
  {
    name: "Maintenance & Support",
    features: [
      { key: "maintenance", label: "Maintenance Schedule" },
      { key: "emergency", label: "Emergency Response" },
      { key: "support", label: "Customer Support" },
      { key: "priority", label: "Priority Service" },
    ],
  },
  {
    name: "Monitoring & Compliance",
    features: [
      { key: "monitoring", label: "System Monitoring" },
      { key: "compliance", label: "Compliance Reporting" },
      { key: "warranty", label: "Warranty Coverage" },
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-500 justify-self-center"
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
      className="w-5 h-5 text-gray-500 justify-self-center"
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
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-600/20 text-green-300 text-sm font-medium rounded-full mb-4 border border-green-500/30"
          >
            Pricing Plans
          </motion.span>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Protection Plan
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Select the fire protection plan that best fits your property size
            and safety requirements. All plans include professional installation
            and ongoing support.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div
          id="pricing"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {pricingTiers.map((tier, index) => (
            <Link href={`/pricing/${tier.id}`} key={tier.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.48, 0.15, 0.25, 0.96],
                }}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`relative group bg-neutral-900/30 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 ${
                  tier.popular
                    ? "border-orange-500/50 bg-gradient-to-b from-orange-500/5 to-red-600/5 scale-105 shadow-orange-500 shadow-2xl"
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </motion.div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    {tier.price !== "Custom" && (
                      <span className="text-gray-400 -ml-4">{tier.period}</span>
                    )}
                    <span className="text-4xl font-bold"> {tier.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-4 px-6 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300 mb-8 ${tier.buttonStyle}`}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tier.buttonText}
                </motion.button>

                {/* Key Features Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Coverage:</span>
                    <span className="text-white font-medium">
                      {tier.features.coverage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sprinklers:</span>
                    <span className="text-white font-medium">
                      {tier.features.sprinklers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Warranty:</span>
                    <span className="text-white font-medium">
                      {tier.features.warranty}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute z-10 inset-0 rounded-2xl bg-gradient-to-b from-orange-600/5 to-(--background)/5 opacity-0 transition-opacity duration-500"
                  animate={{
                    opacity: hoveredTier === tier.id ? 1 : 0,
                  }}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile: Plan Tabs + 2-col feature list */}
        <div className="md:hidden">
          {/* Tabs under nav: sticky so it stays visible */}
          <div className="sticky top-16 z-10 -mx-6 px-6 pb-3 bg-[color:var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/60">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {pricingTiers.map((tier) => {
                const active = tier.id === selectedPlanId;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedPlanId(tier.id)}
                    className={
                      "whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-colors " +
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

          {/* Sleek minimal 2-col table */}
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
                              {value as string}
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
        <div className="hidden md:block overflow-x-auto -mx-6 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: [0.48, 0.15, 0.25, 0.96],
            }}
            className="min-w-[900px] bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-neutral-800 bg-neutral-900/50">
              <div className="text-lg font-semibold text-gray-300">
                Features
              </div>
              {pricingTiers.map((tier) => (
                <div key={tier.id} className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {tier.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{tier.price}</div>
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
                  className="px-6 py-4 bg-neutral-800/30 border-b border-neutral-800"
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
                    className="grid grid-cols-4 gap-4 p-6 border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors"
                  >
                    <div className="text-gray-300 font-medium">
                      {feature.label}
                    </div>
                    {pricingTiers.map((tier) => (
                      <div key={tier.id} className="text-center">
                        {typeof tier.features[
                          feature.key as keyof typeof tier.features
                        ] === "boolean" ? (
                          tier.features[
                            feature.key as keyof typeof tier.features
                          ] ? (
                            <CheckIcon />
                          ) : (
                            <XIcon />
                          )
                        ) : (
                          <span className="text-white text-sm">
                            {
                              tier.features[
                                feature.key as keyof typeof tier.features
                              ] as string
                            }
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

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
          <p className="text-gray-400 mb-8 text-lg">
            Need a custom solution? Our team can design a fire protection system
            tailored to your specific requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Free Consultation
            </motion.a>

            <motion.a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Sales Team
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
