"use client";

import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";

export default function TermsAndConditions() {
	return (
		<div className="min-h-screen">
			<Nav />

			<div className="relative w-full min-h-[40vh] px-4 flex items-center justify-center">
				<img
					src="/about-hero.jpg"
					alt="Terms and Conditions"
					className="absolute w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-neutral-900/50"></div>
				<div className="absolute inset-0 from-75% bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
				<header className="z-20 flex flex-col items-center justify-center">
					<h1 className="text-4xl mb-6 text-center logo-text">
						Terms and Conditions
					</h1>
					<p className="text-lg max-w-2xl text-center">
						Please read these terms carefully before using our services
					</p>
				</header>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-16">
				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Acceptance of Terms</h2>
					<p className="mb-4">
						By accessing and using Chiliwap&apos;s services, you accept and
						agree to be bound by the terms and conditions outlined in this
						agreement. If you do not agree to these terms, please do not use our
						services.
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Use of Services</h2>
					<p className="mb-4">
						Our services are provided subject to the following conditions:
					</p>
					<ul className="list-disc pl-6 mb-6 space-y-2">
						<li>You must be at least 18 years old to use our services</li>
						<li>You agree to provide accurate and complete information</li>
						<li>
							You are responsible for maintaining the security of your account
						</li>
						<li>You will not use our services for any illegal purposes</li>
						<li>You will not attempt to breach our security measures</li>
					</ul>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Intellectual Property</h2>
					<p className="mb-4">
						All content, designs, and materials provided through our services
						are protected by intellectual property rights and remain the
						property of Chiliwap or our licensors. You may not use, copy, or
						distribute our content without explicit permission.
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Limitation of Liability</h2>
					<p className="mb-4">
						Chiliwap shall not be liable for any indirect, incidental, special,
						consequential, or punitive damages resulting from your use or
						inability to use our services. This includes but is not limited to:
					</p>
					<ul className="list-disc pl-6 mb-6 space-y-2">
						<li>Loss of profits or data</li>
						<li>Business interruption</li>
						<li>Hardware or system failure</li>
						<li>Third-party claims</li>
					</ul>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Modifications</h2>
					<p className="mb-4">
						We reserve the right to modify these terms at any time. Changes will
						be effective immediately upon posting to our website. Your continued
						use of our services constitutes acceptance of any modifications.
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl mb-4 logo-text">Contact Information</h2>
					<p className="mb-4">
						For any questions regarding these terms, please contact us at:
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
