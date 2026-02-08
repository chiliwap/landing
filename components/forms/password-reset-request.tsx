"use client";

import { useState, useTransition } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default function PasswordResetRequest({}: {}) {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [devLink, setDevLink] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, startLoading] = useTransition();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setDevLink(null);
		try {
			startLoading(async () => {
				const res = await fetch("/api/auth/password/reset/request", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to send reset link");
				if (data.devLink) setDevLink(data.devLink);
				setSent(true);
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			setError(e.message || "Something went wrong");
		}
	};

	if (sent) {
		return (
			<div className="w-full max-w-sm">
				<p className="text-sm text-neutral-400">
					If an account exists for {email}, a reset link has been sent.
				</p>
				{devLink && (
					<p className="mt-2 text-xs text-yellow-300 break-all">
						Dev link:{" "}
						<a className="underline" href={devLink}>
							{devLink}
						</a>
					</p>
				)}
			</div>
		);
	}

	return (
		<form onSubmit={submit} className="w-full max-w-sm space-y-4">
			<input
				type="email"
				placeholder="Email"
				className="focus:outline-neutral-500 focus:outline-2 outline-0 w-full h-10 p-3 shadow-lg border border-neutral-800 bg-zinc-900/25 rounded-md"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<button
				type="submit"
				className="cursor-pointer flex items-center justify-center h-10 font-semibold tracking-wide w-full shadow bg-orange-700 text-white p-3 rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:opacity-60"
				disabled={loading as unknown as boolean}
			>
				{loading ? "Sending..." : "Send password reset"}
			</button>
			{error && <p className="text-xs text-red-400">{error}</p>}
		</form>
	);
}
