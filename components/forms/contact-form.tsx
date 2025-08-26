"use client";

import { useActionState, useState } from "react";
import type { ContactFormState } from "./actions/contact";

export default function ContactForm({
	action,
	// Accept selectedTier as a prop for future extensibility
	selectedTier,
}: {
	action: (formData: FormData) => Promise<ContactFormState>;
	selectedTier?: string;
}) {
	const [submitting, setSubmitting] = useState(false);
	const [state, formAction] = useActionState<ContactFormState, FormData>(
		async (_prev, formData) => {
			setSubmitting(true);
			const result = await action(formData);
			setSubmitting(false);
			return result;
		},
		{ ok: false }
	);

	return (
		<div className="w-full max-w-2xl mx-auto">
			<form
				action={formAction}
				className="space-y-4"
				onSubmit={() => setSubmitting(true)}
			>
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
						className={`${
							submitting
								? "cursor-not-allowed bg-white/90"
								: "cursor-pointer bg-white hover:bg-white/90"
						} inline-flex items-center justify-center rounded-lg text-black px-4 py-2 text-sm font-medium  transition-colors`}
						disabled={submitting}
					>
						{submitting ? (
							<span className="flex items-center gap-2">
								<svg
									className="mr-3 -ml-1 size-5 animate-spin"
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
								Sending...
							</span>
						) : (
							"Send message"
						)}
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
