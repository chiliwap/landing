import { getUser, findUserBillingById, User, Billing } from "@/lib/dal";
import BillingPanel from "../../../../components/billing/billing-panel";
import AccountPanel from "../../../../components/account/account-panel";
import NotificationPreferences from "../../../../components/account/notification-preferences";
import { Suspense } from "react";

// Helpers: humanize time distance and format local date-time for title hovers
function formatLocalDateTime(date: Date): string {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month = months[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const hours24 = date.getHours();
	const hours12 = hours24 % 12 || 12;
	const ampm = hours24 >= 12 ? "pm" : "am";
	return `${month} ${day} ${year} ${hours12}:${minutes}${ampm}`;
}

// Deterministic UTC formatting to avoid SSR vs client locale drift
function formatShortUTC(date: Date): string {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	return `${
		months[date.getUTCMonth()]
	} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
}

// Stable relative-ish description (coarsened to minutes) to minimize hydration mismatch risk
function stableRelativeUTC(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const min = Math.floor(diffMs / 60000);
	const hr = Math.floor(min / 60);
	const day = Math.floor(hr / 24);
	const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"} ago`;
	if (day > 7) return formatShortUTC(date);
	if (day >= 1) return plural(day, "day");
	if (hr >= 1) return plural(hr, "hour");
	if (min >= 1) return plural(min, "minute");
	return "just now"; // may differ slightly but acceptable with hydration suppression
}

// NOTE: mesh gradient utilities moved to lib/meshGradient and are used in client components

export default async function Profile() {
	const user: User | null = await getUser();
	const billing: Billing | null = await findUserBillingById(user?.id || "");

	if (!user) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center">
				<h1 className="text-3xl font-bold mb-6">Access Denied</h1>
				<p className="text-lg">You must be logged in to view the dashboard.</p>
			</div>
		);
	}

	// two panel page, left side is profile (name, email, picture, address, phone number)
	// right side is billing details and payment methods (cards, paypal, etc)

	// Dummy selection is handled by a client component below

	// Derived display values
	const memberSinceDate = user.createdAt ? new Date(user.createdAt) : null;
	const updatedAtDate = user.updatedAt ? new Date(user.updatedAt) : null;
	const defaultCard = billing?.methods.find(
		(m) => m.id === billing.defaultMethodId
	);
	const cardSummary = defaultCard
		? `${defaultCard.details.brand.toUpperCase()} •••• ${
				defaultCard.details.last4
		  }`
		: billing && billing.methods.length > 0
		? `${billing.methods.length} on file`
		: "None";

	return (
		<main className="pb-16">
			<header className="border-b border-white/5 bg-gradient-to-b from-white/5/0 via-white/[0.02] to-transparent">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
					<div className="flex flex-col lg:flex-row lg:items-end gap-6">
						<div className="flex-1 min-w-0">
							<h1 className="text-3xl font-semibold tracking-tight text-white">
								Account
							</h1>
							<p className="mt-2 text-sm text-neutral-400 max-w-2xl">
								Manage your profile, contact information, security details, and
								payment methods. Updates apply immediately across all Chiliwap
								services.
							</p>
						</div>
						<nav className="flex gap-2 flex-wrap text-[11px] font-medium">
							<a
								href="/dashboard/manage"
								className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
							>
								Manage Devices
							</a>
							<a
								href="/dashboard/billing"
								className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
							>
								Billing
							</a>
						</nav>
					</div>

					{/* Quick Stats */}
					<ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px]">
						<li className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1">
							<span className="uppercase tracking-wide text-neutral-500">
								Member Since
							</span>
							<span
								className="text-neutral-200 font-medium text-sm"
								suppressHydrationWarning
							>
								{memberSinceDate ? formatShortUTC(memberSinceDate) : "—"}
							</span>
						</li>
						<li className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1">
							<span className="uppercase tracking-wide text-neutral-500">
								Last Update
							</span>
							<span
								className="text-neutral-200 font-medium text-sm"
								title={
									updatedAtDate
										? `${formatShortUTC(
												updatedAtDate
										  )} • ${updatedAtDate.toISOString()}`
										: ""
								}
								suppressHydrationWarning
							>
								{updatedAtDate ? stableRelativeUTC(updatedAtDate) : "—"}
							</span>
						</li>
						<li className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1">
							<span className="uppercase tracking-wide text-neutral-500">
								Default Card
							</span>
							<span className="text-neutral-200 font-medium text-sm">
								{cardSummary}
							</span>
						</li>
						<li className="rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-1">
							<span className="uppercase tracking-wide text-neutral-500">
								Cards Stored
							</span>
							<span className="text-neutral-200 font-medium text-sm">
								{billing?.methods.length ?? 0}
							</span>
						</li>
					</ul>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-14">
				<section
					id="profile"
					aria-labelledby="profile-heading"
					className="scroll-mt-24"
				>
					<h2 id="profile-heading" className="sr-only">
						Profile Details
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
						<div className="md:col-span-2">
							<AccountPanel user={user} />
						</div>
						<div id="billing" className="md:col-span-1 scroll-mt-24">
							<h3 className="sr-only">Billing & Payment Methods</h3>
							<Suspense>
								<BillingPanel billing={billing} />
							</Suspense>
						</div>
					</div>
				</section>

				<section id="notifications" aria-labelledby="notifications-heading" className="scroll-mt-24">
					<h2 id="notifications-heading" className="sr-only">
						Notification Preferences
					</h2>
					<NotificationPreferences />
				</section>

				<section aria-labelledby="supporting-info" className="pb-4">
					<h2 id="supporting-info" className="sr-only">
						Additional Information
					</h2>
					<p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
						Need changes beyond what&apos;s editable here (like email or
						ownership transfer)? Contact support and we&apos;ll help you
						securely verify and update sensitive account attributes. Payment
						methods are tokenized; we never store full card numbers.
					</p>
				</section>
			</div>
		</main>
	);
}
