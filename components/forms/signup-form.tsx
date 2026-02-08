"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { validatePassword } from "@/lib/validators/password";

export default function SignupForm({
	redirectPath = "/auth/verify-email",
}: {
	redirectPath?: string;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [devLink, setDevLink] = useState<string | null>(null);
	const [loading, startLoading] = useTransition();
	const router = useRouter();

	const passwordValidation = validatePassword(password);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setDevLink(null);

		if (!email.trim()) {
			setError("Please enter your email address");
			return;
		}

		if (!password) {
			setError("Please enter a password");
			return;
		}

		if (!passwordValidation.isValid) {
			setError(
				"Password must have at least 10 characters and contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)",
			);
			return;
		}

		startLoading(async () => {
			try {
				const res = await fetch("/api/auth/password/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password, name }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Signup failed");
				if (data.devLink) setDevLink(data.devLink);
				setSuccess(true);
				setTimeout(() => router.push(redirectPath), 3000);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				setError(err?.message || "Signup failed");
			}
		});
	};

	if (success) {
		return (
			<div className="w-full max-w-sm text-center">
				<div className="text-green-500 text-5xl mb-4">✓</div>
				<p className="text-neutral-300 mb-2">Account created successfully!</p>
				<p className="text-sm text-neutral-400 mb-4">
					Check your email to verify your account.
				</p>
				{devLink && (
					<p className="mt-4 text-xs text-yellow-300 break-all">
						Dev verification link:{" "}
						<a className="underline hover:text-yellow-200" href={devLink}>
							{devLink}
						</a>
					</p>
				)}
				<p className="text-xs text-neutral-500 mt-4">Redirecting...</p>
			</div>
		);
	}

	return (
		<div className="relative">
			<form onSubmit={submit} className="w-full max-w-sm space-y-4">
				<input
					type="text"
					placeholder="Name"
					className="focus:outline-neutral-500 focus:outline-2 outline-0 w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
					placeholder="Email"
					className="focus:outline-neutral-500 focus:outline-2 outline-0 w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<div className="relative">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						className="focus:outline-neutral-500 focus:outline-2 outline-0 w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((s) => !s)}
						aria-label={showPassword ? "Hide password" : "Show password"}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
					>
						{showPassword ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
								/>
							</svg>
						)}
					</button>
				</div>

				<AnimatePresence mode="wait">
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="overflow-hidden"
						>
							<div className="p-2.5 bg-gradient-to-br from-red-950/90 to-red-900/80 backdrop-blur-sm rounded-lg border border-red-800/50 shadow-lg">
								<div className="flex items-start gap-2">
									<svg
										className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
									<p className="text-xs text-red-200 leading-snug">{error}</p>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<button
					type="submit"
					className="cursor-pointer flex items-center justify-center h-10 font-semibold tracking-wide w-full shadow bg-orange-700 text-white p-3 rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:opacity-60"
					disabled={loading as unknown as boolean}
				>
					{loading ? "Creating account..." : "Create account"}
				</button>
			</form>{" "}
		</div>
	);
}
