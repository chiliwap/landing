"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Google(props: {
	client_id: string;
	children?: React.ReactNode;
}) {
	const [isLoading, startLoading] = React.useTransition();

	const onGoogleSignIn = () => {
		startLoading(() => {
			// Handle Google Sign-In
			const params = {
				scope:
					"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
				include_granted_scopes: "true",
				response_type: "token",
				state: "state_parameter_passthrough_value",
				redirect_uri: `${
					process.env.NODE_ENV === "development"
						? "http://localhost:3000"
						: "https://chiliwap.ca"
				}/api/auth/google/callback`,
				client_id: props.client_id,
			};

			const queryString = new URLSearchParams(params).toString();
			const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;

			window.location.href = googleAuthUrl;
		});
	};
	return (
		<button
			disabled={!props.client_id || isLoading}
			onClick={() => (isLoading ? null : onGoogleSignIn())}
			className={`${
				isLoading
					? "grayscale-100 cursor-not-allowed opacity-75"
					: "cursor-pointer"
			} relative h-10 font-semibold tracking-wide inline-flex justify-center items-center w-full p-3 border border-neutral-800 bg-neutral-700/5 rounded-md shadow-md hover:bg-neutral-700/20 transition-all duration-300`}
		>
			{/* Animated Inset Spinner */}
			<AnimatePresence>
				{isLoading && (
					<motion.div
						initial={{ opacity: 0, filter: "blur(10px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md"
					>
						<svg
							className="size-5 animate-spin text-white/65"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</motion.div>
				)}
			</AnimatePresence>

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
				<path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
			</svg>
			{props.children ?? "Sign In with Google"}
		</button>
	);
}
