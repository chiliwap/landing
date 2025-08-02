"use client";

import Footer from "@/components/footer";
import Gradient from "@/components/mouse-gradient";
import Nav from "@/components/nav";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const FAQ = [
  {
    category: "System Features",
    description: "Understanding the Wildfire Soaking System's capabilities",
    questions: [
      {
        question: "What makes the Wildfire Soaking System smart and reliable?",
        answer:
          "The system features a rugged, waterproof cabinet with a custom Arduino Opta controller, advanced automation, and multi-layer connectivity. It's built to function reliably in wildfire-prone environments.",
      },
      {
        question: "How does the system stay powered during an outage?",
        answer:
          "It uses a standard outlet as primary power, with a 25Ah lithium battery that provides 2–3 days of backup. Automatic switching ensures a seamless transition, and optional solar or generator add-ons can extend backup power.",
      },
      {
        question: "What if Wi-Fi goes down?",
        answer:
          "The system stays connected using a backup Blues cellular module, ensuring remote access and automation even if Wi-Fi is lost.",
      },
      {
        question: "How does the system know when to activate?",
        answer:
          "It uses live NASA wildfire data and activates automatically when a fire is detected within your chosen trigger radius (e.g., 15 km).",
      },
      {
        question: "What can I control and monitor?",
        answer:
          "Using the Chiliwap web platform or the local controller, you can manage valves and pumps, schedule soaks, monitor flow, pressure, and temperature, check water levels, view live camera feeds, and receive system alerts.",
      },
      {
        question: "Is the system customizable?",
        answer:
          "Yes. It's highly adaptable with optional add-ons like cameras, tank level sensors, digital gauges, extra pumps or zones, and smart home integrations.",
      },
      {
        question: "What comes with the system?",
        answer:
          "Standard components include an Arduino Opta controller with cellular backup, power supply, lithium battery, solenoid valves, DIN-mounted parts, and a 2' x 2' irrigation valve box.",
      },
    ],
  },
  {
    category: "Rainwater",
    description: "Using rainwater for wildfire protection",
    questions: [
      {
        question: "How does the system collect and store rainwater?",
        answer:
          "The Wildfire Soaking System can be integrated with a rainwater harvesting setup. Rainwater is collected from your roof and directed into storage tanks through a filtration system to remove debris and contaminants.",
      },
      {
        question: "What are the benefits of using rainwater?",
        answer:
          "Rainwater is a sustainable and cost-effective water source. It reduces reliance on municipal water, lowers utility bills, and provides a dedicated water supply for wildfire protection. Even a modest tank can hold the equivalent of two wildfire helicopter buckets.",
      },
      {
        question: "Can I customize the rainwater system?",
        answer:
          "Yes. We offer a range of tank sizes, filtration options, and integration features. You can choose above-ground or buried tanks, add UV filtration for potable use, and connect the system to irrigation or greywater reuse setups.",
      },
      {
        question: "How does rainwater support wildfire defense?",
        answer:
          "Stored rainwater can be used to power the Wildfire Soaking System during emergencies, ensuring your home has a reliable water source even if municipal supply is disrupted. This enhances resilience and self-sufficiency during fire season.",
      },
    ],
  },
  {
    category: "Maintenance & Support",
    description: "Ensuring your system runs smoothly and efficiently",
    questions: [
      {
        question: "How often should I service the system?",
        answer:
          "We recommend testing the system annually and draining it before winter if it has been activated.",
      },
      {
        question: "What happens if something breaks?",
        answer:
          "Our team is available for support and repairs. We can also provide replacement parts or upgrades.",
      },
      {
        question: "How do I start or stop the system?",
        answer:
          "You can activate or deactivate the system from your phone, computer, or the controller at your home.",
      },
      {
        question: "Can I test the system without activating a full cycle?",
        answer:
          "Yes, the system includes a test mode for safe and quick checks.",
      },
      {
        question: "Do you offer maintenance plans?",
        answer:
          "Yes, we offer optional maintenance packages that include annual inspections, winterization, and system updates.",
      },
    ],
  },
  {
    category: "Insurance & Permits",
    description: "Understanding insurance implications and permit requirements",
    questions: [
      {
        question:
          "Can the Wildfire Soaking System lower my insurance premiums?",
        answer:
          "The Wildfire Soaking System may lower insurance premiums and qualifies for various rebates and incentives. Chiliwap can assist with documentation and help you navigate available programs to reduce overall costs.",
      },
      {
        question:
          "Will I need a permit to install the Wildfire Soaking System?",
        answer:
          "It depends on your location and the scope of the installation, but Chiliwap takes care of all necessary permits and inspections as part of your project.",
      },
    ],
  },
  {
    category: "Integration",
    description: "Integrating the Wildfire Soaking System with existing setups",
    questions: [
      {
        question: "What is the environmental impact like?",
        answer:
          "The system reduces water waste by using stored rainwater efficiently, lowers reliance on municipal water, supports fire resilience, and allows rainwater reuse for various needs.",
      },
      {
        question: "Can I add the system to an exisiting irrigation setup?",
        answer:
          "Yes! We can integrate the Wildfire Soaking System with your existing irrigation system and add separate wildfire zones.",
      },
      {
        question: "What optional features are available?",
        answer:
          "You can add cameras, tank level sensors, pressure gauges, solar panels, backup generators, and more.",
      },
    ],
  },
];

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden">
      <Nav />

      <section className="relative h-full w-full flex flex-col items-center justify-center">
        <header className="text-center mt-32 space-y-6">
          <h3 className="text-3xl logo-text">How can we be of service?</h3>
          <p className="max-w-2xl">
            We're dedicated to ensuring you have the best experience possible.
            Whether you need assistance with a product, have questions about
            your account, or require technical support, our team is here to help
          </p>

          <Link
            className="cursor-pointer tracking-tighter text-neutral-500 hover:text-orange-500 transition-colors duration-500"
            href="mailto:support@chiliwap.com"
          >
            CONTACT US DIRECTLY
          </Link>
        </header>

        <div className="w-full max-w-6xl px-8 py-16 relative">
          <h4 className="text-xl text-center logo-text mb-10">
            Frequently Asked Questions
          </h4>

          <motion.div className="grid grid-cols-3 gap-6 relative">
            {FAQ.map((category, i) => (
              <AnimatePresence key={category.category} mode="wait">
                {selectedCategory === i ? (
                  <>
                    <motion.div
                      key={`modal-${i}`}
                      layoutId={`modal-${i}`}
                      style={{
                        position: "absolute",
                      }}
                      className="z-20 w-full h-full bg-(--background) overflow-y-scroll border-2 border-neutral-800/60 rounded-xl p-6"
                    >
                      <div className="max-w-4xl mx-auto">
                        <h3 className="text-xl logo-text mb-3">
                          {category.category}
                        </h3>
                        <p className="mb-6">{category.description}</p>
                        <div className="space-y-8">
                          {category.questions.map((item) => (
                            <div key={item.question} className="text-left">
                              <h4 className="font-bold text-lg mb-2">
                                {item.question}
                              </h4>
                              <p className="text-neutral-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    <div className="z-0 h-42 w-full" />
                  </>
                ) : (
                  <motion.div
                    onClick={() => setSelectedCategory(i)}
                    layoutId={`modal-${i}`}
                    className="relative h-42 cursor-pointer rounded-lg border-2 border-neutral-800/60 bg-(--background) p-6"
                  >
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-xl logo-text mb-3">
                        {category.category}
                      </h3>
                      <p className="mb-6">{category.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>
        </div>
      </section>

      <Gradient />

      <AnimatePresence>
        {selectedCategory !== null && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            onClick={() => setSelectedCategory(null)}
            className="absolute inset-0 bg-black/30"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Footer />
      </div>
    </main>
  );
}
