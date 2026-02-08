"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import Gradient from "@/components/ui/mouse-gradient";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
	const params = useSearchParams();
	const router = useRouter();
	const token = params?.get("token");
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setMessage("Missing verification token");
			return;
		}

		const verify = async () => {
			try {
				const res = await fetch("/api/auth/verify-email", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				});

				const data = await res.json();

				if (res.ok) {
					setStatus("success");
					setMessage("Email verified successfully!");
					// Redirect to dashboard after 2 seconds
					setTimeout(() => router.push("/dashboard"), 2000);
				} else {
					setStatus("error");
					setMessage(data.error || "Verification failed");
				}
			} catch (e: any) {
				setStatus("error");
				setMessage(e.message || "Verification failed");
			}
		};

		verify();
	}, [token, router]);

	return (
		<main>
			<div className="relative min-h-screen">
				<Nav />

				<div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
					<h2 className="text-2xl mb-6 logo-text">Verify your email</h2>

					{status === "loading" && (
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
							<p className="text-neutral-400">Verifying your email...</p>
						</div>
					)}

					{status === "success" && (
						<div className="text-center">
							<div className="text-green-500 text-5xl mb-4">✓</div>
							<p className="text-neutral-300 mb-4">{message}</p>
							<p className="text-sm text-neutral-400">
								Redirecting to dashboard...
							</p>
						</div>
					)}

					{status === "error" && (
						<div className="text-center max-w-sm">
							<div className="text-red-500 text-5xl mb-4">✕</div>
							<p className="text-red-400 mb-6">{message}</p>
							<div className="space-y-2">
								<p className="text-sm text-neutral-400">
									<Link
										href="/signup"
										className="text-orange-500 hover:underline"
									>
										Create a new account
									</Link>
								</p>
								<p className="text-sm text-neutral-400">
									or{" "}
									<Link
										href="/login"
										className="text-orange-500 hover:underline"
									>
										Sign in
									</Link>
								</p>
							</div>
						</div>
					)}
				</div>

				<Gradient />
			</div>

			<Footer variant="small" />
		</main>
	);
}
