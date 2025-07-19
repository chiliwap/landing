"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Nav() {
  const [stickyNav, setStickyNav] = useState<boolean>(false);

  const router = useRouter();

  return (
    <>
      <motion.nav
        onViewportLeave={() => setStickyNav(true)}
        onViewportEnter={() => setStickyNav(false)}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
          delay: 0.6,
          ease: [0.48, 0.15, 0.25, 0.96],
        }}
        className="fade-in absolute top-0 left-0 w-full z-50"
      >
        <div className="w-full px-24 mx-auto flex justify-between items-center p-1.5">
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
          <div className="space-x-4 text-xs font-bold">
            <a
              className="hover:text-gray-300 transition-colors duration-350"
              href="/news"
              title="News"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            </a>
            <a
              className="hover:text-gray-300 transition-colors duration-350"
              href="/support"
              title="Support"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </a>
            <button
              className="cursor-pointer hover:text-gray-300 transition-colors duration-350"
              onClick={() => router.push("/login")}
              title="Login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6 inline-flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {stickyNav && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              delay: 0,
              ease: [0.48, 0.15, 0.25, 0.96],
            }}
            className="fixed bg-stone-900/20 backdrop-blur-lg top-0 left-0 w-full z-50"
          >
            <div className="w-full px-24 mx-auto flex justify-between items-center p-1.5">
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
                <button
                  onClick={() => router.push("/login")}
                  className="bg-zinc-900 hover:bg-neutral-800 hover:text-white transition-all duration-350 p-1.5 px-4 cursor-pointer rounded-md text-gray-300 "
                >
                  Login
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
