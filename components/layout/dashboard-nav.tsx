"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Item {
	label: string;
	href: string;
	icon?: React.ReactNode;
}

const items: Item[] = [
	{ label: "Overview", href: "/dashboard" },
	{ label: "Account", href: "/dashboard/account" },
	{ label: "Billing", href: "/dashboard/billing" },
	{ label: "Manage", href: "/dashboard/manage" },
];

export default function DashboardNav() {
	const pathname = usePathname();
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/");
	}
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 4);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div className="sticky top-0 z-40">
			{/* Background panel */}
			<div
				className={`transition-colors duration-300 backdrop-blur-md border-b relative ${
					scrolled
						? "bg-neutral-950/70 border-white/10"
						: "bg-neutral-950/40 border-white/5"
				}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
					<Link href="/dashboard" className="flex items-center gap-2 group">
						<img src="/logo.png" alt="Logo" className="h-7 w-auto rounded-sm" />
						<span className="text-sm font-semibold tracking-wide text-white group-hover:text-neutral-300 transition">
							CHILIWAP
						</span>
					</Link>
					<nav className="flex items-center gap-1 text-[13px] font-medium">
						{items.map((item) => {
							const active =
								pathname === item.href ||
								(item.href !== "/dashboard" && pathname.startsWith(item.href));
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`relative px-3 h-8 inline-flex items-center rounded-md transition-colors ${
										active
											? "text-white"
											: "text-neutral-400 hover:text-neutral-200"
									}`}
								>
									{active && (
										<span className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-inset ring-white/15" />
									)}
									<span className="relative z-10">{item.label}</span>
								</Link>
							);
						})}
					</nav>
					<div className="ml-auto flex items-center gap-2">
						<Link
							href="/"
							className="text-neutral-400 hover:text-neutral-200 text-xs tracking-wide uppercase"
						>
							Site
						</Link>
						<span className="text-neutral-700">/</span>
						<button
							type="button"
							onClick={handleLogout}
							className="text-neutral-400 hover:text-red-300 text-xs tracking-wide uppercase cursor-pointer"
						>
							Logout
						</button>
					</div>
				</div>
				{/* subtle top hairline gradient */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
			</div>
		</div>
	);
}
