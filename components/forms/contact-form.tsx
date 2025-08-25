"use client";

import { useActionState } from "react";
import type { ContactFormState } from "./actions/contact";

export default function ContactForm({
	action,
	// Accept selectedTier as a prop for future extensibility
	selectedTier,
}: {
	action: (formData: FormData) => Promise<ContactFormState>;
	selectedTier?: string;
}) {
	const [state, formAction] = useActionState<ContactFormState, FormData>(
		async (_prev, formData) => action(formData),
		{ ok: false }
	);

	return (
		<div className="w-full max-w-2xl mx-auto">
			<form action={formAction} className="space-y-4">
				{/* Pass selectedTier as a hidden field for backend/email usage */}
				<input
					type="hidden"
					name="selectedTier"
					value={selectedTier ?? "None"}
				/>
				{/* Honeypot field to deter bots */}
				<input
					type="text"
					name="company"
					tabIndex={-1}
					autoComplete="off"
					className="hidden"
					aria-hidden="true"
				/>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div>
						<label
							htmlFor="firstName"
							className="block text-sm text-neutral-400"
						>
							First Name
						</label>
						<input
							id="firstName"
							name="firstName"
							required
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
					<div>
						<label
							htmlFor="lastName"
							className="block text-sm text-neutral-400"
						>
							Last Name
						</label>
						<input
							id="lastName"
							name="lastName"
							required
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm text-neutral-400">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label htmlFor="phone" className="block text-sm text-neutral-400">
							Phone (optional)
						</label>
						<input
							id="phone"
							name="phone"
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
					<div>
						<label htmlFor="subject" className="block text-sm text-neutral-400">
							Subject (optional)
						</label>
						<input
							id="subject"
							name="subject"
							className="mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="message" className="block text-sm text-neutral-400">
						Message
					</label>
					<textarea
						id="message"
						name="message"
						required
						rows={6}
						className="resize-none mt-1 w-full rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
					/>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="submit"
						className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
					>
						Send message
					</button>
					{!state.ok && state.error && (
						<p className="text-xs text-red-400">{state.error}</p>
					)}
					{state.ok && (
						<p className="text-xs text-green-400">
							Thanks! We received your message and will be in touch.
						</p>
					)}
				</div>
			</form>
		</div>
	);
}
