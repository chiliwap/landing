import Interactive from "@/components/interactive";
import Nav from "@/components/nav";
import * as motion from "motion/react-client";

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
            <button className="border-white border-4 bg-white text-black hover:bg-neutral-300 hover:border-gray-200 transition-all duration-350 p-2 md:px-20 px-8 cursor-pointer rounded-md">
              Find your solution
            </button>
            <button className="border-white border-4 bg-transparent text-white hover:border-neutral-300 hover:text-gray-200 transition-all duration-350 p-2 md:px-12 px-2 cursor-pointer rounded-md">
              Schedule a consultation
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <Interactive />

      {/* 24/7 Monitoring Section */}
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
        className="text-white px-6 py-16"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            24/7 Monitoring
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Our automated fire protection system ensures your home is monitored
            around the clock, providing peace of mind and immediate response to
            any fire threats. Access your personalized dashboard anytime to view
            your home's status and check real-time wildfire risk assessments for
            your region.
          </p>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transition-all duration-350">
            Learn More
          </button>
        </div>
      </motion.div>

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
