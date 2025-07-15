export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="bg-stone-900/75 backdrop-blur-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-1.5">
          <a href="/" className="roboto text-2xl font-bold text-white">
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
            <button className="bg-zinc-900 hover:border-zinc-900 hover:bg-transparent hover:text-black border-2 border-transparent transition-all duration-350 p-1.5 px-4 cursor-pointer rounded-md text-gray-300 ">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Mountain Image */}
      <div className="relative h-[60vh] w-full px-16">
        <div className="relative h-full w-full overflow-hidden rounded-b-3xl">
          <video className="object-cover" loop autoPlay muted>
            <source src="/video_landing_page.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="text-white px-6 py-16">
        <div className="max-w-2xl mx-auto text-left">
          {/* Start of main */}
          <header className="mb-12">
            <h1 className="text-lg md:text-5xl font-bold tracking-wider">
              Sprinkler System Specs
            </h1>
          </header>

          {/* Numbered List */}
          <div className="text-left mb-12 space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-gray-400 font-mono">1.</span>
              <span className="text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo deleniti unde illo blanditiis neque vero id quisquam
                dicta excepturi nam.
              </span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gray-400 font-mono">2.</span>
              <span className="text-gray-300">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. At
                modi tempora delectus eum sed debitis!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-200 text-xs font-bold px-6 pt-8">
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
