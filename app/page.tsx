import Nav from "@/components/nav";
import * as motion from "motion/react-client";

import dynamic from "next/dynamic";

// Dynamically import the 3D component to avoid SSR issues
const ThreeCanvasWrapper = dynamic(
  () => import("@/components/three-canvas-wrapper"),
  {
    loading: () => (
      <div className="w-full h-[400px] rounded-2xl flex items-center justify-center">
        <div className="text-white">Loading 3D Scene...</div>
      </div>
    ),
  }
);

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero Section with Mountain Image */}
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
        className="relative h-[86vh] w-full px-16"
      >
        <div className="relative h-full w-full overflow-hidden rounded-b-3xl">
          <div className="absolute bg-black/20 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <video className="object-cover" loop autoPlay muted>
            <source src="/video_landing_page.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        <header className="absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center space-y-4">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold">
            Imagine a home that protects itself
          </h3>
          <p className="text-sm md:text-base lg:text-lg">
            Have peace of mind with Chiliwap's automated fire protection
          </p>
        </header>
        <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex flex-row justify-center items-center space-x-4 text-xl">
          <button className="border-white border-4 bg-white text-black hover:bg-gray-200 hover:border-gray-200 transition-all duration-350 p-2 px-20 cursor-pointer rounded-md">
            Find your solution
          </button>
          <button className="border-white border-4 bg-transparent text-white hover:border-gray-200 hover:text-gray-200 transition-all duration-350 p-2 px-12 cursor-pointer rounded-md">
            Schedule a consultation
          </button>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <div className="text-white px-6 py-16">
        <div className="max-w-7xl mx-auto text-left">
          <section className="grid grid-cols-2">
            {/* Start of main */}
            <header className="flex flex-col space-y-8 mb-12">
              <h1 className="text-lg md:text-5xl font-bold tracking-wider">
                Protect your home
              </h1>
              <div className="relative text-right pr-4 text-gray-300">
                2-high range brass impact sprinklers piped from existing hose
                bib. Up to 15.25 meter radius depending on home pressure.
                <hr className="z-20 absolute top-1/2 left-full w-1/3 border-gray-500" />
              </div>
            </header>

            {/* 3D Scene Section */}
            <div className="mb-12">
              <ThreeCanvasWrapper />
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-200 text-xs font-bold px-6 pt-8 mb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-12">
          <a href="/about">Chiliwap © 2025</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact</a>
          <a href="/news">News</a>
          <a href="/updates">Get Updates</a>
          <a href="/updates">Location</a>
        </div>
      </footer>
    </div>
  );
}
