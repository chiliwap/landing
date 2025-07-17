"use client";
import { motion, useScroll } from "motion/react";
import { useRef } from "react";

export default function Nav() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  return (
    <>
      <motion.nav
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
          delay: 0.6,
          ease: [0.48, 0.15, 0.25, 0.96],
        }}
        className="sticky bg-stone-900/20 backdrop-blur-lg top-0 left-0 w-full z-50"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center p-1.5">
          <a
            href="/"
            className="text-2xl font-bold text-white inline-flex items-center"
          >
            <img
              src="/logo.png"
              alt="Chiliwap Logo"
              className="inline-block h-8 mr-2"
            />{" "}
            CHILIWAP
          </a>
          <div className="space-x-4 text-xs font-bold ">
            <a
              href="/consultation"
              className="text-gray-300 hover:text-white transition-colors duration-350"
            >
              Schedule a Consultation
            </a>
            <a
              href="/support"
              className="text-gray-300 hover:text-white transition-colors duration-350"
            >
              Support
            </a>
            <button className="bg-zinc-900 hover:bg-neutral-800 hover:text-white transition-all duration-350 p-1.5 px-4 cursor-pointer rounded-md text-gray-300 ">
              Login
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
