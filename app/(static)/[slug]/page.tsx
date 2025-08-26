"use client";

import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import Interactive from "@/components/sections/interactive";
import Nav from "@/components/layout/nav";
import Pricing from "@/components/sections/pricing";
import Solutions from "@/components/sections/solutions";
import Hero from "@/components/sections/hero";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";

export default function Landing(props: { params: Promise<{ slug: string }> }) {
	const { slug } = use(props.params);

	// find the corresponding id for the slug and scroll to element
	const scrollToElement = (id: string) => {
		const element = document.getElementById(id);

		if (element == null) {
			// redirect to 404 page
			notFound();
		}

		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	useEffect(() => {
		scrollToElement(slug);
	}, [slug]);

	return (
		<div className="min-h-screen">
			<Nav />
			<Hero />

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
