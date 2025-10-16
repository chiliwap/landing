import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import Gradient from "@/components/ui/mouse-gradient";
import Link from "next/link";

import Google from "@/components/auth/google";
import MagicLinkForm from "@/components/forms/magic-link-form";

export const metadata = {
	title: "Login | Chiliwap",
	description:
		"Log in to your Chiliwap account to access exclusive features and support.",
};

export default function Login() {
	return (
		<main>
			<div className="relative min-h-screen">
				<Nav />

				{/* Login Form Section */}
				<div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
					<h2 className="text-2xl mb-6 logo-text">Sign In</h2>
					<MagicLinkForm redirectPath="/dashboard" />
					<p className="text-sm text-neutral-400 mt-6">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="cursor-pointer text-orange-500 hover:underline"
						>
							Sign up
						</Link>
					</p>
					<div className="w-full max-w-lg flex justify-center items-center">
						<hr className="my-6 w-1/2 border-neutral-900 taper-left" />
						<p className="px-4 font-semibold text-neutral-500 text-sm">OR</p>
						<hr className="my-6 w-1/2 border-neutral-900 taper-right" />
					</div>
					{/* Google Sign-In Button */}
					<div className="w-full max-w-sm flex justify-center items-center">
						<Google client_id={process.env.GOOGLE_CLIENT_ID!} />
					</div>

					<p className="text-sm text-gray-500 mt-4 max-w-sm text-center">
						Need help signing in?{" "}
						<Link
							href="/reset-password"
							className="hover:text-orange-500 underline transition-colors duration-750"
						>
							Reset your password
						</Link>{" "}
					</p>

					<p className="text-sm text-gray-500 mt-6 max-w-sm text-center">
						By using Chiliwap, you are agreeing to our{" "}
						<Link
							href="/terms"
							className="hover:text-orange-500 underline transition-colors duration-750"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="hover:text-orange-500 underline transition-colors duration-750"
						>
							Privacy Policy
						</Link>
					</p>
				</div>

				<Gradient />
			</div>

			{/* Footer Notes */}
			<Footer variant="small" />
		</main>
	);
}
