"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
	label: string;
	href: string;
	badge?: string;
	group?: string;
}

const nav: Array<NavItem> = [
	{ label: "Overview", href: "/dashboard" },
	{ label: "Balances", href: "/dashboard/balances" },
	{ label: "Account", href: "/dashboard/account" },
	{ label: "Billing", href: "/dashboard/billing" },
	{ label: "Controllers", href: "/dashboard/manage" },
	{ label: "Alerts", href: "/dashboard/alerts" },
	{ label: "Activity", href: "/dashboard/activity" },
	{ label: "Schedule", href: "/dashboard/schedule" },
];

export default function DashboardSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/");
	}
	return (
		<>
			{/* mobile toggle */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="md:hidden fixed top-3 left-3 z-50 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900/70 backdrop-blur border border-white/10 text-neutral-300 hover:text-white"
				aria-label="Toggle navigation"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			</button>
			<aside
				className={`fixed inset-y-0 left-0 w-64 z-40 transform md:translate-x-0 transition-transform duration-300 ${
					open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
				} bg-neutral-950/90 backdrop-blur border-r border-white/10 flex flex-col`}
			>
				<div className="h-14 flex items-center gap-2 px-5 border-b border-white/10">
					<Link href="/dashboard" className="flex items-center gap-2 group">
						<img src="/logo.png" alt="Logo" className="h-7 w-auto rounded" />
						<span className="text-xs font-semibold tracking-wide text-white group-hover:text-neutral-300">
							CHILIWAP
						</span>
					</Link>
				</div>
				<nav className="flex-1 overflow-y-auto py-6 space-y-6 px-4 text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
					<div className="space-y-1">
						{nav.map((item) => {
							const active =
								pathname === item.href ||
								(item.href !== "/dashboard" && pathname.startsWith(item.href));
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setOpen(false)}
									className={`group relative flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
										active
											? "text-white"
											: "text-neutral-400 hover:text-neutral-200"
									}`}
								>
									{active && (
										<span className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-inset ring-white/15" />
									)}
									<span className="relative z-10 flex-1">{item.label}</span>
									{item.badge && (
										<span className="relative z-10 ml-2 inline-flex items-center rounded-full bg-white/10 text-[10px] px-2 py-0.5 text-white/70">
											{item.badge}
										</span>
									)}
								</Link>
							);
						})}
					</div>
				</nav>
				<div className="p-4 border-t border-white/10 text-[11px] text-neutral-500 space-y-3">
					<div>
						<span className="block text-neutral-400 mb-1 font-medium uppercase tracking-wide text-[10px]">
							System Status
						</span>
						<div className="flex items-center gap-2 text-xs text-neutral-300">
							<span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
							All services normal
						</div>
					</div>
					<div className="flex items-center gap-3 pt-2">
						<Link href="/" className="text-neutral-400 hover:text-neutral-200">
							Site
						</Link>
						<span className="text-neutral-700">/</span>
						<button
							type="button"
							onClick={handleLogout}
							className="text-neutral-400 hover:text-red-300 cursor-pointer"
						>
							Logout
						</button>
					</div>
				</div>
			</aside>
			{/* overlay */}
			{open && (
				<div
					onClick={() => setOpen(false)}
					className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
				/>
			)}
		</>
	);
}
