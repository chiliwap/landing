"use client";

import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <Nav />

      <div className="relative w-full min-h-[40vh] px-4 flex items-center justify-center">
        <img
          src="/about-hero.jpg"
          alt="Privacy Policy"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/50"></div>
        <div className="absolute inset-0 from-75% bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
        <header className="z-20 flex flex-col items-center justify-center">
          <h1 className="text-4xl mb-6 text-center logo-text">
            Privacy Policy
          </h1>
          <p className="text-lg max-w-2xl text-center">
            Learn how we collect, use, and protect your personal information
          </p>
        </header>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-12">
          <h2 className="text-2xl mb-4 logo-text">Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Device data and usage statistics</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4 logo-text">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you important updates and notifications</li>
            <li>Improve our products and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4 logo-text">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4 logo-text">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request corrections to your data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4 logo-text">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Privacy Policy, please contact
            us at:
            <br />
            <a
              href="mailto:info@chiliwap.com"
              className="text-blue-400 hover:text-blue-300"
            >
              info@chiliwap.com
            </a>
          </p>
        </section>

        <div className="text-sm text-neutral-400">
          Last updated: July 29, 2025
        </div>
      </div>

      <Footer />
    </div>
  );
}
