import Google from "@/components/auth/google";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import Gradient from "@/components/ui/mouse-gradient";
import Link from "next/link";
import SignupForm from "@/components/forms/signup-form";

export const metadata = {
	title: "Sign Up | Chiliwap",
	description: "Create a new account to start using Chiliwap's services.",
};

export default function Signup() {
	return (
		<main>
			<div className="relative min-h-screen">
				<Nav />

				{/* Login Form Section */}
				<div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
					<h2 className="text-2xl mb-6 logo-text">Create an account</h2>
					<SignupForm redirectPath="/dashboard" />
					<p className="text-sm text-neutral-400 mt-4 max-w-sm text-center">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-orange-500 hover:underline transition-colors duration-750"
						>
							Sign In
						</Link>{" "}
					</p>
					<div className="w-full max-w-lg flex justify-center items-center">
						<hr className="my-6 w-1/2 border-neutral-900 taper-left" />
						<p className="px-4 font-semibold text-neutral-500 text-sm">OR</p>
						<hr className="my-6 w-1/2 border-neutral-900 taper-right" />
					</div>
					{/* Google Sign-In Button */}
					<div className="w-full max-w-sm flex justify-center items-center">
						<Google client_id={process.env.GOOGLE_CLIENT_ID!}>
							Sign Up with Google
						</Google>{" "}
					</div>
					<p className="text-sm text-neutral-500 mt-4 max-w-sm text-center">
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
