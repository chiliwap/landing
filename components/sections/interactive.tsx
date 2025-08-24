"use client";

import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import { useRef, useState } from "react";

// Dynamically import the 3D component to avoid SSR issues
const ThreeCanvasWrapper = dynamic(
  () => import("@/components/3d/three-canvas-wrapper"),
  {
    // Ensure this only renders on the client. Safari can choke on SSR + WebGL hydration.
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-2xl flex items-center justify-center">
        <div className="text-white">Loading 3D Scene...</div>
      </div>
    ),
  }
);

// Content data for each rotation state
const contentStates = [
  {
    subtitle: "advanced sprinkler systems",
    description:
      "2-high range brass impact sprinklers piped from existing hose bib. Up to 15.25 meter radius depending on home pressure.",
    highlight: "Coverage Area",
  },
  {
    subtitle: "precision targeting",
    description:
      "Adjustable spray patterns and pressure control ensure optimal water distribution across your entire property.",
    highlight: "Precision Control",
  },
  {
    subtitle: "reliable protection",
    description:
      "Weather-resistant brass construction provides years of dependable fire protection for your property.",
    highlight: "Durability",
  },
];

// Replace the existing rotation transforms with discrete state-based rotations
const rotationStates = [
  { rotateY: 0, rotateX: 0, rotateZ: 0 }, // State 1: Front view
  { rotateY: 120, rotateX: 0, rotateZ: 0 }, // State 2: Angled side view
  { rotateY: 240, rotateX: 0, rotateZ: 0 }, // State 3: Different angle
];

export default function Interactive() {
  const ref = useRef(null);
  const [currentState, setCurrentState] = useState(0);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const currentRotation = rotationStates[currentState];

  // Track which content state we're in based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const progress = latest;

    // Content states start after the layout transition (50-100% scroll)
    if (progress >= 0.5) {
      const adjustedProgress = (progress - 0.5) / 0.5; // Normalize to 0-1 range

      if (adjustedProgress < 0.33) {
        setCurrentState(0);
      } else if (adjustedProgress < 0.66) {
        setCurrentState(1);
      } else {
        setCurrentState(2);
      }
    }
  });

  // Transform values for layout transition - starts later and moves slower
  // Title: starts centered, moves to left column
  const titleX = useTransform(scrollYProgress, [0.3, 0.5], [0, -410]);
  const titleY = useTransform(scrollYProgress, [0.3, 0.5], [-300, -25]);
  const titleScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.7]);

  // 3D Model: starts centered below title, moves to right column
  const modelX = useTransform(scrollYProgress, [0.3, 0.5], [0, 300]);
  const modelY = useTransform(scrollYProgress, [0.3, 0.5], [50, 150]);

  // Additional content opacity - fades in after layout transition
  const contentOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.45, 0.55], [30, 0]);

  // HR line opacity
  const hrOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);

  return (
    <>
      {/* Mobile simplified layout */}
      <div className="lg:hidden text-white relative w-full px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Protect your home
        </h2>
        <div className="w-full max-w-md mx-auto">
          <ThreeCanvasWrapper
            rotationState={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
            currentState={0}
          />
        </div>
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-3">
            {contentStates[0].highlight}
          </span>
          <p className="text-gray-300 max-w-xl mx-auto">
            {contentStates[0].description}
          </p>
        </div>
      </div>

      {/* Desktop sticky scroll-driven layout */}
      <motion.div
        ref={ref}
        className="hidden lg:block text-white min-h-[500vh] relative"
      >
        {/* Sticky container */}
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full relative h-full">
            {/* Main Title - Persists and moves from center to left */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-[transform]"
              style={{
                x: titleX,
                y: titleY,
                scale: titleScale,
              }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-wider whitespace-nowrap">
                Protect your home
              </h1>
            </motion.div>

            {/* 3D Model - Persists and moves from center to right */}
            <motion.div
              className="absolute w-full max-w-md h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-[transform] [backface-visibility:hidden]"
              style={{
                x: modelX,
                y: modelY,
              }}
            >
              <ThreeCanvasWrapper
                rotationState={currentRotation}
                currentState={currentState}
              />
            </motion.div>

            {/* Additional Content - Fades in after layout transition */}
            <motion.div
              className="absolute left-0 top-1/2 max-w-full pl-6 transform-gpu will-change-[transform]"
              style={{
                opacity: contentOpacity,
                y: contentY,
                //   transform: "translateY(-50%)",
              }}
            >
              {/* HR Line */}
              <motion.hr
                className="absolute top-[70px] left-full w-72 border-gray-500 hidden lg:block"
                style={{ opacity: hrOpacity }}
              />

              {/* "with" subtitle */}
              <p className="block font-bold mb-4 text-2xl md:text-3xl">
                <span className="tracking-wider text-gray-300">with </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    className="text-gray-400"
                    key={currentState}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {contentStates[currentState].subtitle}
                  </motion.span>
                </AnimatePresence>
              </p>

              {/* State-specific content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentState + "-content"}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* State indicator */}
                  <motion.span
                    className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, ease: [0.48, 0.15, 0.25, 0.96] }}
                  >
                    {contentStates[currentState].highlight}
                  </motion.span>

                  <motion.div
                    className="relative text-gray-300 max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {contentStates[currentState].description}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="flex space-x-3 mt-8">
                {contentStates.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentState
                        ? "bg-white w-8"
                        : "bg-gray-600 w-2"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: index === currentState ? 1.1 : 1 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
