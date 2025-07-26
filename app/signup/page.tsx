"use client";

import Nav from "@/components/nav";
import { useMotionValue } from "motion/react";
import { useState, useEffect } from "react";

export default function Login() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(x * 100);
      mouseY.set(y * 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main>
      <div className="relative min-h-screen">
        <Nav />

        {/* Login Form Section */}
        <div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
          <h2 className="text-2xl font-bold mb-6 logo-text">
            Create an account
          </h2>
          <form className="w-full max-w-sm space-y-4">
            <input
              type="name"
              placeholder="John Doe"
              className="w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
              required
            />

            <button
              type="submit"
              disabled
              className="cursor-not-allowed flex items-center justify-center font-semibold tracking-wide h-10 w-full shadow bg-orange-600/30 text-white p-3 rounded-md hover:bg-orange-500/35 transition-colors duration-300"
            >
              Sign Up with Email
            </button>

            <p className="text-sm text-neutral-400 mt-4 max-w-sm text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-orange-500 hover:underline transition-colors duration-750"
              >
                Sign In
              </a>{" "}
            </p>
          </form>
          <div className="w-full max-w-lg flex justify-center items-center">
            <hr className="my-6 w-1/2 border-neutral-900 taper-left" />
            <p className="px-4 font-semibold text-neutral-500 text-sm">OR</p>
            <hr className="my-6 w-1/2 border-neutral-900 taper-right" />
          </div>
          {/* Google Sign-In Button */}
          <div className="w-full max-w-sm flex justify-center items-center">
            <button
              disabled
              className="cursor-not-allowed h-10 font-semibold tracking-wide inline-flex justify-center items-center w-full p-3 border border-neutral-800 bg-neutral-700/5 rounded-md shadow-md hover:bg-neutral-700/20 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 mr-2"
                // xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use href="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path
                  clipPath="url(#b)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                />
              </svg>
              Sign Up with Google
            </button>
          </div>
          <p className="text-sm text-neutral-500 mt-4 max-w-sm text-center">
            By using Chiliwap, you are agreeing to our{" "}
            <a
              href="/terms"
              className="hover:text-orange-500 underline transition-colors duration-750"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="hover:text-orange-500 underline transition-colors duration-750"
            >
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Animated mesh gradient that follows mouse */}
        <div
          className="z-10 inset-0 absolute opacity-40 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.2) 0%, rgba(239, 68, 68, 0.1) 7%, rgba(0, 0, 0, 0.2) 14%)`,
          }}
        />
      </div>
    </main>
  );
}
