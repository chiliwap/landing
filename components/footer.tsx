import Link from "next/link";

export default function Footer(props: {
  className?: string;
  variant?: "large" | "small";
}) {
  return (
    <>
      {props.variant === "small" ? (
        <footer className="z-20 text-center text-sm text-neutral-500">
          <p className="absolute bottom-12 left-12">
            Imagine a home that protects itself.
          </p>

          <p className="absolute bottom-12 right-12">
            &copy; {new Date().getFullYear()} Chiliwap. All rights reserved.
          </p>
        </footer>
      ) : (
        <footer
          className={`relative overflow-hidden text-gray-200 text-xs mt-8 pb-6 bg-stone-900/60 noise ${
            props.className ?? ""
          }`}
        >
          <div className="rounded-b-[5rem] bg-(--background) h-24 w-full" />

          {/* 4 columns layout */}
          <div className="z-20 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto mt-12 mb-24">
            <img src="/logo.png" alt="Chiliwap Logo" className="size-20 mb-2" />

            <div className="flex flex-col space-y-1 group">
              <h5 className="font-bold text-xl mb-3">Company</h5>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/about"
              >
                About
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/news"
              >
                News
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/careers"
              >
                Careers
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/support"
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col space-y-1 group">
              <h5 className="font-bold text-xl mb-3">Quick Links</h5>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/products"
              >
                Virtual Consultation
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/support"
              >
                Support
              </Link>
            </div>
            <div className="flex flex-col space-y-1 group">
              <h5 className="font-bold text-xl mb-3">Legal</h5>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
                href="/terms"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <p className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 tracking-widest text-center logo-text text-6xl">
            CHILIWAP
          </p>

          {/* <div className="z-20 max-w-6xl mx-auto h-64 flex flex-col sm:flex-row justify-center items-center gap-12 text-white">
            <Link href="/about">Chiliwap © 2025</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/support">Support</Link>
            <Link href="/news">News</Link>
            <Link href="/updates">Get Updates</Link>
            <Link href="/location">Location</Link>
          </div> */}
        </footer>
      )}
    </>
  );
}
