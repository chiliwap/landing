import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import Interactive from "@/components/sections/interactive";
import Nav from "@/components/layout/nav";
import Pricing from "@/components/sections/pricing";
import Solutions from "@/components/sections/solutions";
import * as motion from "motion/react-client";
import Link from "next/link";

export default function Landing() {
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
          <div className="absolute inset-0 bg-black/30" />
          <video
            className="absolute inset-0 w-full h-full object-cover"
            loop
            autoPlay
            muted
          >
            <source src="/video_landing_page.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <header className="absolute top-2/6 text-center space-y-3 px-4">
            <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
              Imagine a home that protects itself
            </h3>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              Have peace of mind with Chiliwap&apos;s automated fire protection
            </p>
          </header>
          <div className="absolute bottom-18 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:text-xl sm:text-base text-xs px-4">
            <Link
              href="#solutions"
              title="Find your solution"
              className="border-white border-2 sm:border-4 bg-white text-black hover:bg-neutral-300 hover:border-gray-200 transition-all duration-350 py-2 md:px-20 px-8 cursor-pointer rounded-md w-full sm:w-auto text-center"
            >
              Find your solution
            </Link>
            <Link
              href="/products"
              title="Schedule a consultation"
              className="border-white border-2 sm:border-4 bg-transparent text-white hover:border-neutral-300 hover:text-gray-200 transition-all duration-350 py-2 md:px-12 px-4 cursor-pointer rounded-md w-full sm:w-auto text-center"
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
