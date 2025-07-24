import Interactive from "@/components/interactive";
import Nav from "@/components/nav";
import Pricing from "@/components/pricing";
import Solutions from "@/components/solutions";
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
        <div className="relative flex flex-col justify-center items-center w-full max-h-full overflow-hidden md:rounded-b-3xl">
          <div className="absolute bg-black/20 w-full h-full top-1/2 left-1/2 pt-5 transform -translate-x-1/2 -translate-y-1/2" />
          <video className="object-cover" loop autoPlay muted>
            <source src="/video_landing_page.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <header className="absolute top-2/6 text-center space-y-4">
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold">
              Imagine a home that protects itself
            </h3>
            <p className="text-sm md:text-base lg:text-lg">
              Have peace of mind with Chiliwap's automated fire protection
            </p>
          </header>
          <div className="absolute bottom-18 flex flex-row justify-center items-center space-x-4 md:text-xl sm:text-base text-xs">
            <Link
              href="#solutions"
              title="Find your solution"
              className="border-white border-4 bg-white text-black hover:bg-neutral-300 hover:border-gray-200 transition-all duration-350 p-2 md:px-20 px-8 cursor-pointer rounded-md"
            >
              Find your solution
            </Link>
            <Link
              href="/consultation"
              title="Schedule a consultation"
              className="border-white border-4 bg-transparent text-white hover:border-neutral-300 hover:text-gray-200 transition-all duration-350 p-2 md:px-12 px-2 cursor-pointer rounded-md"
            >
              Schedule a consultation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <Interactive />

      {/* Solutions Section */}
      <Solutions />
      <hr className="justify-self-center w-3/4 border-gray-600 my-8" />

      {/* Pricing Section */}
      <Pricing />

      {/* Footer */}
      <footer className="text-gray-200 text-xs font-bold px-6 pt-8 mb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-12">
          <Link href="/about">Chiliwap © 2025</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/news">News</Link>
          <Link href="/updates">Get Updates</Link>
          <Link href="/location">Location</Link>
        </div>
      </footer>
    </div>
  );
}
