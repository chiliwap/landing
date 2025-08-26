import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import Interactive from "@/components/sections/interactive";
import Nav from "@/components/layout/nav";
import Pricing from "@/components/sections/pricing";
import Solutions from "@/components/sections/solutions";
import Hero from "@/components/sections/hero";

export default function Landing() {
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
