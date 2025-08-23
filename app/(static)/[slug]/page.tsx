"use client";

import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import Interactive from "@/components/sections/interactive";
import Nav from "@/components/layout/nav";
import Pricing from "@/components/sections/pricing";
import Solutions from "@/components/sections/solutions";
import * as motion from "motion/react-client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";

export default function Landing(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);

  // find the corresponding id for the slug and scroll to element
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);

    if (element == null) {
      // redirect to 404 page
      notFound();
    }

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    scrollToElement(slug);
  }, [slug]);

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero Section with Mountain Video */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.4,
          delay: 0.2,
          ease: [0.48, 0.15, 0.25, 0.96],
        }}
        className="relative flex flex-col items-center justify-start h-[86vh] w-full md:px-16 px-0"
      >
        <div className="relative flex flex-col justify-center items-center w-full h-full overflow-hidden md:rounded-b-3xl ">
          <div className="absolute z-0 inset-0 bg-black/40" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(700px 380px at 50% 50%, rgba(251,146,60,0.05), transparent 60%), radial-gradient(1100px 600px at 50% 50%, rgba(239,68,68,0.005), transparent 70%)",
            }}
          />
          <video
            className="absolute -z-10 inset-0 w-full h-full object-cover"
            loop
            autoPlay
            muted
          >
            <source src="/video_landing_page.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <header className="z-10 absolute top-2/6 text-center px-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2 text-xs font-medium text-white/70 ring-1 ring-white/15 bg-white/5">
              Wildfire Home Protection
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Imagine a home that protects itself
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Have peace of mind with Chiliwap&apos;s automated fire protection
            </p>
          </header>
          <div className="z-10 absolute bottom-18 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
            <Link
              href="#solutions"
              title="Find your solution"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-white/90 hover:border-white/25 transition-colors duration-300 w-full sm:w-auto text-center"
            >
              Find your solution
            </Link>
            <Link
              href="/products"
              title="Schedule a consultation"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:border-white/25 hover:bg-white/5 transition-colors duration-300 w-full sm:w-auto text-center"
            >
              Schedule a consultation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <Interactive />

      {/* Features Section */}
      <Features />

      {/* Solutions Section */}
      <Solutions />
      <hr className="taper-edges justify-self-center w-full border-neutral-700 my-8" />

      {/* Pricing Section */}
      <Pricing />

      {/* Footer */}
      <Footer />
    </div>
  );
}
