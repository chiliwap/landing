"use client";

import { useState, useTransition } from "react";

export default function MagicLinkForm({
	redirectPath = "/dashboard",
}: {
	redirectPath?: string;
}) {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, startLoading] = useTransition();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			startLoading(async () => {
				const res = await fetch("/api/auth/magic/request", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, redirectPath }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to send link");
				setSent(true);
			});
		} catch (e: any) {
			setError(e.message || "Something went wrong");
		}
	};

	if (sent) {
		return (
			<p className="text-sm text-neutral-400">
				We sent a sign-in link to {email}. Check your inbox.
			</p>
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
				disabled={loading}
			>
				{loading ? "Sending..." : "Send magic link"}
			</button>
			{error && <p className="text-xs text-red-400">{error}</p>}
		</form>
	);
}
