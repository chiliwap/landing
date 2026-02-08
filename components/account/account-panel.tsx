"use client";

import {
	useActionState,
	useState,
	useTransition,
	useMemo,
	useCallback,
} from "react";
import type { User } from "@/lib/dal";
import {
	updateProfile,
	type ProfileUpdateState,
} from "../forms/actions/profile";

interface Props {
	user: User;
}

// Styled label+input group
function Field({
	label,
	name,
	type = "text",
	defaultValue,
	placeholder,
	disabled = false,
	maxLength,
	textarea = false,
	value,
	onChange,
}: {
	label: string;
	name: string;
	type?: string;
	defaultValue?: string;
	placeholder?: string;
	disabled?: boolean;
	maxLength?: number;
	textarea?: boolean;
	value?: string;
	onChange?: (v: string) => void;
}) {
	const base =
		"mt-1 w-full rounded-md border border-neutral-700/60 bg-neutral-900/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-500/60 focus:border-neutral-500 transition text-sm placeholder:text-neutral-500 px-3 py-2 disabled:bg-neutral-900/30 disabled:text-neutral-500 disabled:opacity-60 text-neutral-200";
	return (
		<div className="space-y-1">
			<label
				className="block text-[11px] uppercase tracking-wide text-neutral-400 font-medium"
				htmlFor={name}
			>
				{label}
			</label>
			{textarea ? (
				<textarea
					id={name}
					name={name}
					defaultValue={defaultValue}
					placeholder={placeholder}
					disabled={disabled}
					maxLength={maxLength}
					rows={3}
					className={base + " resize-none"}
				/>
			) : (
				<input
					id={name}
					name={name}
					type={type}
					defaultValue={value === undefined ? defaultValue : undefined}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					maxLength={maxLength}
					className={base}
				/>
			)}
		</div>
	);
}

export default function AccountPanel({ user }: Props) {
	const [optimistic, setOptimistic] = useState({
		name: user.name,
		phone: user.phone,
		address: user.address,
	});

	// Live phone formatting (client-side UX only; server re-sanitizes & formats again)
	const formatPhone = useCallback((input: string) => {
		let raw = input.replace(/ext\.?/gi, "x");
		// Split off extension if present
		let ext = "";
		const m = raw.match(/(?:x)\s*(\d{1,10})$/i);
		if (m) {
			ext = m[1];
			raw = raw.slice(0, m.index).trim();
		}
		let digits = raw.replace(/[^0-9]/g, "");
		let country = "";
		if (digits.length > 10 && digits.startsWith("1")) {
			country = "+1 ";
			digits = digits.slice(1);
		}
		const core = digits.slice(0, 10);
		let out = core;
		if (core.length <= 3) {
			out = core.length ? `(${core}` : "";
		} else if (core.length <= 6) {
			out = `(${core.slice(0, 3)}) ${core.slice(3)}`;
		} else {
			out = `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`;
		}
		let finalStr = (country + out).trim();
		if (ext) finalStr = `+${ext} ${finalStr}`;
		return finalStr;
	}, []);

	const handlePhoneChange = useCallback(
		(val: string) => {
			setOptimistic((prev) => ({ ...prev, phone: formatPhone(val) }));
		},
		[formatPhone]
	);
	const [editing, setEditing] = useState(false);
	const [pending, startTransition] = useTransition();
	const [state, formAction] = useActionState<ProfileUpdateState, FormData>(
		async (_prev, formData) => {
			const result = await updateProfile(formData);
			if (result.ok && result.user) {
				setOptimistic((prev) => ({
					...prev,
					name: result.user?.name ?? prev.name,
					phone: result.user?.phone,
					address: result.user?.address,
				}));
				setEditing(false);
			}
			return result;
		},
		{ ok: true }
	);

	const updatedAt = new Date(user.updatedAt);
	const memberSince = useMemo(
		() => new Date(user.createdAt).toLocaleDateString("en-CA"),
		[user.createdAt]
	);
	const initials = useMemo(
		() =>
			(user.name || user.email || "?")
				.split(/\s+/)
				.slice(0, 2)
				.map((p) => p[0]?.toUpperCase())
				.join("") || "?",
		[user.name, user.email]
	);

	return (
		<div className="relative w-full">
			<div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40 backdrop-blur-md [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.5)] min-h-[500px] flex flex-col">
				{/* Subtle top radial highlight */}
				<div
					aria-hidden
					className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[340px] h-[140px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),transparent_70%)]"
				/>
				<form
					action={(fd) => startTransition(() => formAction(fd))}
					className="relative p-5 sm:p-6 space-y-6 flex-1 flex flex-col"
				>
					<input
						type="text"
						name="company"
						className="hidden"
						tabIndex={-1}
						aria-hidden="true"
					/>
					{/* Header / Identity */}
					<div className="flex items-start gap-4 pb-4 border-b border-white/5">
						<div className="relative shrink-0 size-14 rounded-full bg-neutral-800 ring-1 ring-white/10 flex items-center justify-center text-sm font-medium text-neutral-300 overflow-hidden">
							{user.picture ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={user.picture}
									alt="Avatar"
									className="w-full h-full object-cover"
								/>
							) : (
								<span className="cursor-default select-none">{initials}</span>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-start gap-2 flex-wrap">
								<h2
									className="truncate text-sm font-semibold text-white leading-snug break-words max-w-full"
									title={optimistic.name}
								>
									{optimistic.name || "Unnamed"}
								</h2>
								{!editing && (
									<button
										type="button"
										onClick={() => setEditing(true)}
										className="cursor-pointer inline-flex items-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-medium text-neutral-300 px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-white/20"
									>
										Edit
									</button>
								)}
								{editing && (
									<button
										type="button"
										onClick={() => setEditing(false)}
										className="cursor-pointer inline-flex items-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-medium text-neutral-300 px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-white/20"
									>
										Cancel
									</button>
								)}
							</div>
							<p
								className="truncate mt-0.5 text-[11px] text-neutral-500 break-words"
								title={user.email}
							>
								{user.email}
							</p>
							{/* Meta info list to avoid truncation */}
							<ul className="mt-2 grid gap-1.5 text-[10px] text-neutral-500 sm:grid-cols-2 lg:grid-cols-4 max-w-full">
								<li className="inline-flex items-center gap-1">
									<span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
									Active
								</li>
								<li title={updatedAt.toLocaleString("en-CA")}>
									Updated{" "}
									{Intl.DateTimeFormat(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									}).format(updatedAt)}
								</li>
								<li>Member since {memberSince}</li>
								<li className="flex items-center gap-1">
									<span className="truncate font-mono text-neutral-600 break-all">
										{user.id}
									</span>
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(user.id).catch(() => {});
										}}
										className="cursor-pointer px-1.5 py-0.5 text-[9.5px] rounded border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
										aria-label="Copy user id"
									>
										Copy
									</button>
								</li>
							</ul>
						</div>
						{editing && (
							<button
								type="submit"
								disabled={pending}
								className={`cursor-pointer shrink-0 inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 text-[11px] font-medium px-3 py-1.5 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 ${
									pending ? "opacity-70 cursor-not-allowed" : ""
								}`}
							>
								{pending && (
									<svg
										className="size-3 animate-spin"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="12" cy="12" r="10" className="opacity-25" />
										<path d="M4 12a8 8 0 018-8" />
									</svg>
								)}
								Save
							</button>
						)}
					</div>

					{/* Fields Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<Field
							label="Name"
							name="name"
							defaultValue={optimistic.name}
							disabled={!editing || pending}
							maxLength={120}
							placeholder="Your name"
						/>
						<Field
							label="Email"
							name="email"
							defaultValue={user.email}
							disabled={true}
						/>
						<Field
							label="Phone"
							name="phone"
							value={optimistic.phone || ""}
							onChange={handlePhoneChange}
							disabled={!editing || pending}
							maxLength={40}
							placeholder="+1 (555) 123-4567"
						/>
						<Field
							label="Address"
							name="address"
							defaultValue={optimistic.address}
							disabled={!editing || pending}
							textarea
							maxLength={240}
							placeholder="Street, City, State"
						/>
					</div>

					{/* Divider + Additional Meta */}
					<div className="border-t border-white/5 pt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<p className="text-[11px] uppercase tracking-wide text-neutral-500 font-medium">
								Account
							</p>
							<ul className="truncate text-[12px] space-y-1 text-neutral-400 break-words">
								<li className="break-all">
									<span className="text-neutral-500">ID:</span>{" "}
									<span className="font-mono text-[11px] text-neutral-500">
										{user.id}
									</span>
								</li>
								<li>
									<span className="text-neutral-500">Status:</span>{" "}
									<span className="text-emerald-400">Active</span>
								</li>
								<li>
									<span className="text-neutral-500">Member:</span>{" "}
									{memberSince}
								</li>
							</ul>
						</div>
						<div className="space-y-2">
							<p className="text-[11px] uppercase tracking-wide text-neutral-500 font-medium">
								Security
							</p>
							<ul className="text-[12px] space-y-1 text-neutral-400">
								<li>
									2FA: <span className="text-red-400">Disabled</span>
								</li>
								<li>
									Last update:{" "}
									{Intl.DateTimeFormat(undefined, {
										month: "short",
										day: "numeric",
									}).format(updatedAt)}
								</li>
								<li>Sessions: 1 active</li>
							</ul>
						</div>
						<div className="space-y-2">
							<p className="text-[11px] uppercase tracking-wide text-neutral-500 font-medium">
								Usage (Mock)
							</p>
							<div className="space-y-2">
								<div>
									<div className="flex justify-between text-[10px] text-neutral-500 mb-1">
										<span>API Calls</span>
										<span>42%</span>
									</div>
									<div className="h-1.5 rounded bg-neutral-800 overflow-hidden">
										<div className="h-full w-[42%] bg-gradient-to-r from-violet-500/70 to-fuchsia-500/70" />
									</div>
								</div>
								<div>
									<div className="flex justify-between text-[10px] text-neutral-500 mb-1">
										<span>Storage</span>
										<span>73%</span>
									</div>
									<div className="h-1.5 rounded bg-neutral-800 overflow-hidden">
										<div className="h-full w-[73%] bg-gradient-to-r from-emerald-500/70 to-teal-500/70" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="pt-0.5 h-10">
						{!state.ok && state.error && (
							<p className="text-[11px] text-red-400">{state.error}</p>
						)}
						{state.ok && state.user && !pending && (
							<p className="text-[11px] text-emerald-400">Profile updated.</p>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
