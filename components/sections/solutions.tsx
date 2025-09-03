"use client";

import { motion } from "motion/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/modal";
const ContactForm = dynamic(() => import("@/components/forms/contact-form"), {
  ssr: false,
});
import { submitContact } from "@/components/forms/actions/contact";

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-white/60 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const solutions = [
  {
    id: "fire-protection",
    title: "Fire Protection Systems",
    description:
      "Advanced sprinkler and suppression systems designed to protect your property with cutting-edge technology and reliable performance.",
    features: [
      "Complete property soaking coverage",
      "Long range rooftop sprinklers",
      "Weather-resistant construction",
      "Automated activation systems",
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
      </svg>
    ),
    gradient: "from-orange-500 to-red-600",
    href: "/solutions/fire-protection",
  },
  {
    id: "system-design",
    title: "System Design",
    description:
      "Custom fire protection system planning tailored to your specific needs, ensuring optimal coverage and compliance with safety regulations.",
    features: [
      "Custom system blueprints",
      "Compliance with local codes",
      "Risk assessment analysis",
      "Cost-effective solutions",
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
        />
      </svg>
    ),
    gradient: "from-blue-500 to-purple-600",
    href: "/solutions/system-design",
  },
  {
    id: "rainwater",
    title: "Rainwater Harvesting",
    description:
      "Innovative solutions for capturing and reusing rainwater, reducing your environmental impact and conserving water resources.",
    features: [
      "Custom rainwater collection systems",
      "Eco-friendly, low-maintenance designs",
      "On-site water reuse for irrigation",
      "Integration with fire protection systems",
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
    gradient: "from-green-500 to-teal-600",
    href: "/solutions/sprinkler-installation",
  },
  {
    id: "maintenance",
    title: "Maintenance Services",
    description:
      "Regular maintenance and inspections to ensure your fire protection system remains in optimal condition and meets all safety standards.",
    features: [
      "Scheduled maintenance plans",
      "24/7 emergency repairs",
      "Compliance inspections",
      "System performance reports",
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.867 19.125h.008v.008h-.008v-.008Z"
        />
      </svg>
    ),
    gradient: "from-yellow-500 to-orange-600",
    href: "/solutions/maintenance",
  },
];

export default function Solutions() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
            id="solutions"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium text-white/70 ring-1 ring-white/15 bg-white/5"
          >
            Our Solutions
          </motion.span>

          <h2 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-white">
            Comprehensive Fire
            <br />
            Protection Solutions
          </h2>

          <p className="text-base md:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            From initial system design to ongoing maintenance, we provide
            complete fire protection services tailored to safeguard your
            property and ensure peace of mind.
          </p>
        </motion.div>

        {/* Solutions Grid in sleeker, muted style */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* subtle center orange gradient, sits under cards (no seams) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(700px 380px at 50% 50%, rgba(251,146,60,0.05), transparent 60%), radial-gradient(1100px 600px at 50% 50%, rgba(239,68,68,0.005), transparent 70%)",
            }}
          />
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              id={`solutions-${solution.id}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.48, 0.15, 0.25, 0.96],
              }}
              onMouseEnter={() => setHoveredCard(solution.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
            >
              <div className="relative z-10 h-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)]">
                {/* Soft card spotlight */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-50 transition-opacity duration-300 bg-[radial-gradient(420px_140px_at_50%_-20%,rgba(255,255,255,0.08),transparent)] group-hover:opacity-80" />

                {/* Icon */}
                <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-lg mb-5 text-white/80 bg-white/5 ring-1 ring-white/10">
                  {solution.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <h3 className="text-base font-semibold text-white">
                    {solution.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features List with checks */}
                  <ul className="relative z-10 space-y-2 mt-5 text-sm">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1 + featureIndex * 0.05,
                          duration: 0.4,
                        }}
                        className="flex items-start gap-2 text-white/70"
                      >
                        <CheckIcon />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button: subtle ghost style */}
                  <button
                    onClick={() => setModalOpen(true)} // opens contact modal
                    className="relative z-10 inline-flex items-center justify-center mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:border-white/20 hover:bg-white/5 transition-colors"
                  >
                    Learn more
                  </button>
                </div>
                {/* Subtle border-glow on hover using gradient */}
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Contact Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-center">Contact</h2>
        <ContactForm action={submitContact} selectedTier={""} />
      </Modal>
    </section>
  );
}
