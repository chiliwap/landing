"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav(props: { className?: string }) {
	// Start as non-sticky on server and during hydration to avoid mismatches; sync after mount.
	const [stickyNav, setStickyNav] = useState<boolean>(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);

	// Keep sticky state in sync with scroll position (also fixes refresh-in-middle-of-page)
	useEffect(() => {
		const onScroll = () => setStickyNav(window.scrollY > 0);
		// Set once on mount in case initial state was incorrect (defensive)
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navigationItems = [
		{
			name: "Solutions",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 text-neutral-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
					/>
				</svg>
			),
			href: "/solutions",
			dropdown: {
				sections: [
					{
						title: "Protection Systems",
						items: [
							{
								name: "Fire Protection Systems",
								description: "Advanced sprinkler and suppression systems",
								href: "/solutions-fire-protection",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
										/>
									</svg>
								),
							},
							{
								name: "System Design",
								description: "Custom fire protection system planning",
								href: "/solutions-system-design",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
										/>
									</svg>
								),
							},
						],
					},
					{
						title: "Services",
						items: [
							{
								name: "Rainwater Harvesting",
								description:
									"Harvest rainwater for irrigation and non‑potable use.",
								href: "/solutions-rainwater",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
										/>
									</svg>
								),
							},
							{
								name: "Maintenance Services",
								description: "Regular maintenance and inspections",
								href: "/solutions-maintenance",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.867 19.125h.008v.008h-.008v-.008Z"
										/>
									</svg>
								),
							},
						],
					},
				],
			},
		},
		{
			name: "Products",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 text-neutral-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
					/>
				</svg>
			),
			href: "/products",
			dropdown: {
				sections: [
					{
						title: "Sprinkler Systems",
						items: [
							{
								name: "Full Coverage System",
								description: "Comprehensive fire protection system.",
								href: "/products/full-coverage",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
										/>
									</svg>
								),
							},
							{
								name: "High Performance Sprinklers",
								description: "High-performance sprinkler heads",
								href: "/products/sprinklers",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
										/>
									</svg>
								),
							},
						],
					},
					{
						title: "Control & Monitoring",
						items: [
							{
								name: "Control & Monitoring Systems",
								description: "Advanced monitoring and detection systems",
								href: "/products/monitoring",
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
										/>
									</svg>
								),
							},
							// {
							//   name: "Monitoring Equipment",
							//   description: "Advanced monitoring and detection systems",
							//   href: "/products/monitoring",
							//   icon: (
							//     <svg
							//       xmlns="http://www.w3.org/2000/svg"
							//       fill="none"
							//       viewBox="0 0 24 24"
							//       strokeWidth={1.5}
							//       stroke="currentColor"
							//       className="size-6"
							//     >
							//       <path
							//         strokeLinecap="round"
							//         strokeLinejoin="round"
							//         d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
							//       />
							//     </svg>
							//   ),
							// },
						],
					},
				],
			},
		},
		{
			name: "Firemap",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 text-neutral-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
					/>
				</svg>
			),
			href: "http://firemap.live",
		},
		{
			name: "Pricing",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 text-neutral-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			),
			href: "/pricing",
		},
		{
			name: "About",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 text-neutral-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
					/>
				</svg>
			),
			href: "/about",
		},
	];

	return (
		<>
			<motion.nav
				onViewportLeave={() => setStickyNav(true)}
				onViewportEnter={() => setStickyNav(false)}
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
				}}
				transition={{
					duration: 0.4,
					delay: 0.6,
					ease: [0.48, 0.15, 0.25, 0.96],
				}}
				className={`fade-in absolute top-0 left-0 w-full z-50 ${
					props.className ?? ""
				}`}
			>
				{/* Faint gradient top border for depth */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div className="w-full mx-auto flex justify-between items-center p-1.5 px-4 sm:px-6 md:px-12 lg:px-24">
					<Link
						href="/"
						className="text-2xl text-white inline-flex items-center logo-text"
					>
						<img
							src="/logo.png"
							alt="Chiliwap Logo"
							className="inline-block h-8 mr-2 "
						/>{" "}
						CHILIWAP
					</Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center space-x-8">
						{navigationItems.map((item) => (
							<div
								key={item.name}
								className="relative"
								onMouseEnter={() =>
									item.dropdown && setActiveDropdown(item.name)
								}
								onMouseLeave={() => setActiveDropdown(null)}
							>
								<Link
									href={item.href}
									className={`text-white hover:text-gray-300 group transition-colors duration-300 flex items-center space-x-1 py-2 ${
										activeDropdown === item.name ? "text-gray-300" : ""
									}`}
								>
									<span>{item.name}</span>
									{item.dropdown && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											className="size-4 group-hover:rotate-180 transition-transform duration-350"
										>
											<path
												fillRule="evenodd"
												d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{/* Active indicator */}
									{/* {activeDropdown === item.name && ( */}
									<motion.div
										// layoutId="activeTab"
										className="absolute group-hover:bg-black/15 bg-transparent inset-0 rounded-4xl -z-10 -mx-3 transition-colors duration-350"
									/>
									{/* )} */}
								</Link>
							</div>
						))}
					</div>

					{/* Right icons (desktop) */}
					<div className="hidden sm:flex space-x-4 text-xs font-bold">
						<Link
							className="hover:text-gray-300 transition-colors duration-350"
							href="/news"
							title="News"
						>
							{NewsIcon}
						</Link>
						<Link
							className="hover:text-gray-300 transition-colors duration-350"
							href="/support"
							title="Support"
						>
							{SupportIcon}
						</Link>
						<Link
							className="cursor-pointer hover:text-gray-300 transition-colors duration-350"
							href="/login"
							title="Login"
						>
							{UserIcon}
						</Link>
					</div>

					{/* Mobile hamburger */}
					<button
						aria-label="Open menu"
						aria-expanded={mobileOpen}
						onClick={() => setMobileOpen((o) => !o)}
						className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
					>
						{mobileOpen ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-6"
							>
								<path
									fillRule="evenodd"
									d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Mobile menu panel */}
				<AnimatePresence>
					{mobileOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="lg:hidden px-4 sm:px-6 md:px-12 lg:px-24 pb-4"
						>
							<div className="mt-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md p-3 space-y-1">
								{navigationItems.map((item) => (
									<div
										className="w-full flex justify-between px-4 text-neutral-300"
										key={item.name}
									>
										<Link
											href={item.href}
											onClick={() => setMobileOpen(false)}
											className="block px-3 py-2 rounded-md hover:bg-white/10"
										>
											{item.name}
										</Link>
										{item.icon}
									</div>
								))}
								<div className="my-2 h-px bg-white/10 taper-edges-sm" />
								<div className="grid grid-cols-3 gap-2 text-sm">
									<Link
										href="/news"
										onClick={() => setMobileOpen(false)}
										className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
									>
										News
									</Link>
									<Link
										href="/support"
										onClick={() => setMobileOpen(false)}
										className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
									>
										Support
									</Link>
									<Link
										href="/login"
										onClick={() => setMobileOpen(false)}
										className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
									>
										Login
									</Link>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Dropdown Menu */}
				<AnimatePresence>
					{/* Hide complex dropdown entirely on small screens */}
					{activeDropdown && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] }}
							className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 z-50 hidden lg:block"
							onMouseEnter={() => setActiveDropdown(activeDropdown)}
							onMouseLeave={() => setActiveDropdown(null)}
						>
							<div className="bg-black/90 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl overflow-hidden w-[90vw] max-w-[700px]">
								{/* Fixed height container to prevent layout shift */}
								<div className="relative h-[250px] overflow-hidden">
									<AnimatePresence mode="wait">
										{navigationItems
											.filter((item) => item.name === activeDropdown)
											.map((item) => (
												<motion.div
													key={item.name}
													initial={{ opacity: 0, scale: 0.99 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.99 }}
													transition={{
														duration: 0.1,
														ease: [0.48, 0.15, 0.25, 0.96],
													}}
													className="absolute inset-0 p-6"
												>
													{/* Column Layout */}
													<div className="grid grid-cols-2 gap-8">
														{item.dropdown?.sections.map(
															(section, sectionIndex) => (
																<div key={section.title} className="space-y-4">
																	<h3 className="text-sm ml-2 text-gray-400">
																		{section.title}
																	</h3>
																	<div className="space-y-2">
																		{section.items.map(
																			(dropdownItem, index) => (
																				<Link
																					key={dropdownItem.name}
																					href={dropdownItem.href}
																				>
																					<motion.div
																						className="group flex items-start space-x-3 p-3 rounded-lg transition-all duration-200"
																						// initial={{ opacity: 0, y: 10 }}
																						// animate={{ opacity: 1, y: 0 }}
																						// transition={{
																						//   delay:
																						//     (sectionIndex * 2 + index) * 0.03,
																						//   duration: 0.2,
																						// }}
																					>
																						<div className="text-base mt-0.5 flex-shrink-0 border border-gray-800 group-hover:border-white rounded p-1 group-hover:text-black text-gray-300 group-hover:bg-white transition-colors duration-200">
																							{dropdownItem.icon}
																						</div>
																						<div className="flex-1 min-w-0">
																							<h4 className="text-white text-sm font-medium transition-colors truncate">
																								{dropdownItem.name}
																							</h4>
																							<p className="text-gray-400 group-hover:text-gray-300 text-xs mt-0.5 line-clamp-2 h-8 transition-colors">
																								{dropdownItem.description}
																							</p>
																						</div>
																					</motion.div>
																				</Link>
																			)
																		)}
																	</div>
																</div>
															)
														)}
													</div>
												</motion.div>
											))}
									</AnimatePresence>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>

			{/* Sticky Navigation Bar */}
			<AnimatePresence>
				{stickyNav && (
					<motion.nav
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: 0.2,
							delay: 0,
							ease: [0.48, 0.15, 0.25, 0.96],
						}}
						className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md"
					>
						{/* Faint gradient top border for depth (sticky) */}
						<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
						<div className="w-full px-3 sm:px-4 md:px-8 lg:px-12">
							<div className="mx-auto max-w-7xl mt-2 mb-2 flex justify-between items-center px-3 py-2">
								<Link
									href="/"
									className="text-2xl text-white inline-flex items-center logo-text"
								>
									<img
										src="/logo.png"
										alt="Chiliwap Logo"
										className="inline-block h-8 mr-2"
									/>{" "}
									CHILIWAP
								</Link>
								{/* Sticky: desktop quick links */}
								<div className="hidden md:flex items-center gap-3">
									<Link
										href="/products"
										className="inline-flex items-center justify-center rounded-lg bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-white/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
									>
										Schedule a consultation
									</Link>
									<Link
										href="/support"
										className="text-sm font-medium text-white/80 hover:text-white px-2 py-1 transition-colors duration-300"
									>
										Support
									</Link>
									<Link
										href="/login"
										className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/25"
									>
										Login
									</Link>
								</div>

								{/* Sticky: mobile hamburger */}
								<button
									aria-label="Open menu"
									aria-expanded={mobileOpen}
									onClick={() => setMobileOpen((o) => !o)}
									className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
								>
									{mobileOpen ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="size-6"
										>
											<path
												fillRule="evenodd"
												d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
						{/* Subtle bottom hairline for separation */}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
						{/* Sticky: mobile panel (reuse top one) */}
						<AnimatePresence>
							{mobileOpen && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									className="md:hidden px-4 sm:px-6 pb-4"
								>
									<div className="mt-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md p-3 space-y-1">
										{navigationItems.map((item) => (
											<div
												className="w-full flex justify-between px-4 text-neutral-300"
												key={item.name}
											>
												<Link
													href={item.href}
													onClick={() => setMobileOpen(false)}
													className="block px-3 py-2 rounded-md hover:bg-white/10"
												>
													{item.name}
												</Link>
												{item.icon}
											</div>
										))}
										<div className="my-2 h-px bg-white/10 taper-edges-sm" />
										<div className="grid grid-cols-3 gap-2 text-sm">
											<Link
												href="/news"
												onClick={() => setMobileOpen(false)}
												className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
											>
												News
											</Link>
											<Link
												href="/support"
												onClick={() => setMobileOpen(false)}
												className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
											>
												Support
											</Link>
											<Link
												href="/login"
												onClick={() => setMobileOpen(false)}
												className="px-3 py-2 rounded-md text-white/80 hover:bg-white/10 text-center"
											>
												Login
											</Link>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.nav>
				)}
			</AnimatePresence>
		</>
	);
}

const UserIcon = (
	<svg
		className="size-6 inline-flex"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<g fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 11C2 5.47723 6.47723 1 12 1C17.5228 1 22 5.47723 22 11C22 16.5228 17.5228 21 12 21C6.47723 21 2 16.5228 2 11Z"
				fill="url(#1752500502811-9294189_user_existing_0_t4csz04ye)"
				data-glass="origin"
				mask="url(#1752500502811-9294189_user_mask_s86i2afs5)"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 11C2 5.47723 6.47723 1 12 1C17.5228 1 22 5.47723 22 11C22 16.5228 17.5228 21 12 21C6.47723 21 2 16.5228 2 11Z"
				fill="url(#1752500502811-9294189_user_existing_0_t4csz04ye)"
				data-glass="clone"
				filter="url(#1752500502811-9294189_user_filter_nsyh9isk4)"
				clipPath="url(#1752500502811-9294189_user_clipPath_1jvvjoq1t)"
			></path>
			<path
				d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z"
				fill="url(#1752500502811-9294189_user_existing_1_bnqb6d6gm)"
				data-glass="blur"
			></path>
			<path
				d="M17.5586 22.25V23H6.44141V22.25H17.5586ZM18.75 21.0586C18.7499 17.5745 15.9255 14.7501 12.4414 14.75H11.5586C8.07451 14.7501 5.25012 17.5745 5.25 21.0586C5.25 21.7165 5.78354 22.25 6.44141 22.25V23L6.24316 22.9902C5.26408 22.891 4.5 22.0638 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414L12.8047 14.0088C16.5342 14.198 19.4999 17.2821 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23V22.25C18.2165 22.25 18.75 21.7165 18.75 21.0586Z"
				fill="url(#1752500502811-9294189_user_existing_2_duz35xtpd)"
			></path>
			<path
				d="M14.75 8.5C14.75 6.98122 13.5188 5.75 12 5.75C10.4812 5.75 9.25 6.98122 9.25 8.5C9.25 10.0188 10.4812 11.25 12 11.25V12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12V11.25C13.5188 11.25 14.75 10.0188 14.75 8.5Z"
				fill="url(#1752500502811-9294189_user_existing_3_x5xjz4yjs)"
			></path>
			<defs>
				<linearGradient
					id="1752500502811-9294189_user_existing_0_t4csz04ye"
					x1="12"
					y1="1"
					x2="12"
					y2="21"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#575757"></stop>
					<stop offset="1" stopColor="#151515"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502811-9294189_user_existing_1_bnqb6d6gm"
					x1="12"
					y1="5"
					x2="12"
					y2="23"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
					<stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502811-9294189_user_existing_2_duz35xtpd"
					x1="12"
					y1="14"
					x2="12"
					y2="19.212"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#fff"></stop>
					<stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502811-9294189_user_existing_3_x5xjz4yjs"
					x1="12"
					y1="5"
					x2="12"
					y2="9.054"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#fff"></stop>
					<stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
				</linearGradient>
				<filter
					id="1752500502811-9294189_user_filter_nsyh9isk4"
					x="-100%"
					y="-100%"
					width="400%"
					height="400%"
					filterUnits="objectBoundingBox"
					primitiveUnits="userSpaceOnUse"
				>
					<feGaussianBlur
						stdDeviation="2"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="SourceGraphic"
						edgeMode="none"
						result="blur"
					></feGaussianBlur>
				</filter>
				<clipPath id="1752500502811-9294189_user_clipPath_1jvvjoq1t">
					<path
						d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z"
						fill="url(#1752500502811-9294189_user_existing_1_bnqb6d6gm)"
					></path>
				</clipPath>
				<mask id="1752500502811-9294189_user_mask_s86i2afs5">
					<rect width="100%" height="100%" fill="#FFF"></rect>
					<path
						d="M12.4414 14C16.3397 14.0001 19.4999 17.1603 19.5 21.0586C19.5 22.1307 18.6307 23 17.5586 23H6.44141C5.36932 23 4.5 22.1307 4.5 21.0586C4.50012 17.1603 7.6603 14.0001 11.5586 14H12.4414ZM12 5C13.933 5 15.5 6.567 15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5Z"
						fill="#000"
					></path>
				</mask>
			</defs>
		</g>
	</svg>
);

const NewsIcon = (
	<svg
		className="size-6 inline-flex"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<g fill="none">
			<path
				d="M19.8 7C20.9201 7 21.4802 7 21.908 7.21799C22.2843 7.40973 22.5903 7.7157 22.782 8.09202C23 8.51984 23 9.0799 23 10.2V14.6C23 16.8402 23 17.9603 22.564 18.816C22.1805 19.5686 21.5686 20.1805 20.816 20.564C19.9603 21 18.8402 21 16.6 21C16.0003 21 15.3477 20.9253 14.7546 21.031C14.3513 21.1029 14.0296 21.3136 13.6938 21.5374C13.4363 21.7091 13.1783 21.93 12.8727 21.9845C12.7857 22 12.6956 22 12.5156 22H11.4844C11.3044 22 11.2143 22 11.1273 21.9845C10.8217 21.93 10.5637 21.7091 10.3062 21.5374C9.97044 21.3136 9.64872 21.1029 9.24542 21.031C8.65232 20.9253 7.99966 21 7.4 21C5.15979 21 4.03968 21 3.18404 20.564C2.43139 20.1805 1.81947 19.5686 1.43597 18.816C1 17.9603 1 16.8402 1 14.6L1 10.2C1 9.07989 1 8.51984 1.21799 8.09202C1.40973 7.71569 1.7157 7.40973 2.09202 7.21799C2.51984 7 3.0799 7 4.2 7L19.8 7Z"
				fill="url(#1752500502767-6164915_book-open_existing_0_icxw9y0nx)"
				data-glass="origin"
				mask="url(#1752500502767-6164915_book-open_mask_0lsha4amw)"
			></path>
			<path
				d="M19.8 7C20.9201 7 21.4802 7 21.908 7.21799C22.2843 7.40973 22.5903 7.7157 22.782 8.09202C23 8.51984 23 9.0799 23 10.2V14.6C23 16.8402 23 17.9603 22.564 18.816C22.1805 19.5686 21.5686 20.1805 20.816 20.564C19.9603 21 18.8402 21 16.6 21C16.0003 21 15.3477 20.9253 14.7546 21.031C14.3513 21.1029 14.0296 21.3136 13.6938 21.5374C13.4363 21.7091 13.1783 21.93 12.8727 21.9845C12.7857 22 12.6956 22 12.5156 22H11.4844C11.3044 22 11.2143 22 11.1273 21.9845C10.8217 21.93 10.5637 21.7091 10.3062 21.5374C9.97044 21.3136 9.64872 21.1029 9.24542 21.031C8.65232 20.9253 7.99966 21 7.4 21C5.15979 21 4.03968 21 3.18404 20.564C2.43139 20.1805 1.81947 19.5686 1.43597 18.816C1 17.9603 1 16.8402 1 14.6L1 10.2C1 9.07989 1 8.51984 1.21799 8.09202C1.40973 7.71569 1.7157 7.40973 2.09202 7.21799C2.51984 7 3.0799 7 4.2 7L19.8 7Z"
				fill="url(#1752500502767-6164915_book-open_existing_0_icxw9y0nx)"
				data-glass="clone"
				filter="url(#1752500502767-6164915_book-open_filter_dric4oey8)"
				clipPath="url(#1752500502767-6164915_book-open_clipPath_99y0rffwb)"
			></path>
			<path
				d="M17.1058 2.86537C18.4374 2.56947 19.1032 2.42152 19.6257 2.59361C20.0838 2.74451 20.472 3.05589 20.7187 3.47039C21 3.94312 21 4.62513 21 5.98917L21 14.4331C21 15.349 21 15.807 20.8377 16.1849C20.6945 16.5182 20.4634 16.8063 20.1691 17.0184C19.8354 17.2588 19.3883 17.3582 18.4942 17.5568L12.3471 18.9229C12.2176 18.9517 12.1528 18.966 12.0874 18.9718C12.0292 18.9769 11.9708 18.9769 11.9126 18.9718C11.8472 18.966 11.7824 18.9517 11.6529 18.9229L5.50582 17.5568C4.6117 17.3582 4.16464 17.2588 3.83093 17.0184C3.53658 16.8063 3.30545 16.5182 3.1623 16.1849C3 15.8069 3 15.349 3 14.4331L3 5.98917C3 4.62513 3 3.94312 3.28134 3.47039C3.52803 3.05589 3.9162 2.74451 4.37434 2.59361C4.89684 2.42152 5.56262 2.56947 6.89418 2.86537L11.6529 3.92287C11.7824 3.95165 11.8472 3.96604 11.9126 3.97178C11.9708 3.97688 12.0292 3.97688 12.0874 3.97178C12.1528 3.96604 12.2176 3.95165 12.3471 3.92287L17.1058 2.86537Z"
				fill="url(#1752500502767-6164915_book-open_existing_1_gwnxwxu1a)"
				data-glass="blur"
			></path>
			<path
				d="M20.25 5.98921C20.25 5.29355 20.2494 4.82046 20.2178 4.46088C20.1867 4.10809 20.1309 3.94983 20.0742 3.85443C19.92 3.59536 19.677 3.3999 19.3906 3.3056C19.2852 3.27098 19.1185 3.25158 18.7676 3.29778C18.4097 3.34493 17.9476 3.44668 17.2686 3.59759L12.5098 4.65521C12.3988 4.67988 12.2789 4.70764 12.1533 4.71869C12.0516 4.72761 11.9484 4.72761 11.8467 4.71869C11.7211 4.70764 11.6012 4.67988 11.4902 4.65521L6.73145 3.59759C6.05237 3.44668 5.59029 3.34493 5.23242 3.29778C4.88146 3.25158 4.71479 3.27098 4.60938 3.3056C4.32304 3.3999 4.07996 3.59536 3.92578 3.85443C3.86911 3.94983 3.81326 4.10809 3.78223 4.46088C3.75062 4.82046 3.75 5.29355 3.75 5.98921V14.4336C3.75 14.9022 3.75076 15.2137 3.76855 15.4561C3.78565 15.6887 3.81605 15.8059 3.85156 15.8887C3.94103 16.097 4.08556 16.2776 4.26953 16.4102C4.34261 16.4628 4.45054 16.5178 4.67383 16.585C4.90661 16.6549 5.21124 16.7235 5.66895 16.8252L11.8154 18.1905C11.8836 18.2056 11.9214 18.2141 11.9502 18.2198C11.9732 18.2242 11.9794 18.2247 11.9785 18.2246C11.9928 18.2259 12.0072 18.2259 12.0215 18.2246C12.0206 18.2247 12.0268 18.2242 12.0498 18.2198C12.0786 18.2141 12.1164 18.2056 12.1846 18.1905L18.3311 16.8252C18.7888 16.7235 19.0934 16.6549 19.3262 16.585C19.5495 16.5178 19.6574 16.4628 19.7305 16.4102C19.9144 16.2776 20.059 16.097 20.1484 15.8887C20.1839 15.8059 20.2143 15.6887 20.2314 15.4561C20.2492 15.2137 20.25 14.9022 20.25 14.4336V5.98921ZM21 14.4336L20.9971 15.04C20.9895 15.5728 20.9595 15.9012 20.8379 16.1846L20.7803 16.3076C20.6361 16.5891 20.4266 16.833 20.1689 17.0186L20.0381 17.1026C19.7167 17.2854 19.2765 17.3828 18.4941 17.5567L12.3467 18.9229C12.2174 18.9516 12.1523 18.966 12.0869 18.9717C12.058 18.9742 12.029 18.9756 12 18.9756L11.9131 18.9717C11.8803 18.9688 11.8473 18.964 11.8066 18.9561L11.6533 18.9229L5.50586 17.5567C4.72347 17.3828 4.28327 17.2854 3.96191 17.1026L3.83105 17.0186C3.53671 16.8065 3.30526 16.5179 3.16211 16.1846C3.04052 15.9012 3.01053 15.5728 3.00293 15.04L3 14.4336V5.98921C3 4.71045 2.99965 4.0309 3.23145 3.56146L3.28125 3.47064C3.49715 3.10787 3.82136 2.82349 4.20605 2.65715L4.37402 2.59368C4.89653 2.42158 5.56298 2.56926 6.89453 2.86516L11.6533 3.92279C11.7826 3.95152 11.8477 3.96588 11.9131 3.97162C11.9709 3.97666 12.0291 3.97666 12.0869 3.97162C12.1523 3.96588 12.2174 3.95152 12.3467 3.92279L17.1055 2.86516C18.437 2.56926 19.1035 2.42158 19.626 2.59368C20.084 2.74461 20.4721 3.05623 20.7188 3.47064C21 3.94336 21 4.62538 21 5.98921V14.4336Z"
				fill="url(#1752500502767-6164915_book-open_existing_2_8znynyepl)"
			></path>
			<defs>
				<linearGradient
					id="1752500502767-6164915_book-open_existing_0_icxw9y0nx"
					x1="12"
					y1="7"
					x2="12"
					y2="22"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#575757"></stop>
					<stop offset="1" stopColor="#151515"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502767-6164915_book-open_existing_1_gwnxwxu1a"
					x1="21"
					y1="10.5"
					x2="3"
					y2="10.5"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
					<stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502767-6164915_book-open_existing_2_8znynyepl"
					x1="12"
					y1="2.52"
					x2="12"
					y2="12.05"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#fff"></stop>
					<stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
				</linearGradient>
				<filter
					id="1752500502767-6164915_book-open_filter_dric4oey8"
					x="-100%"
					y="-100%"
					width="400%"
					height="400%"
					filterUnits="objectBoundingBox"
					primitiveUnits="userSpaceOnUse"
				>
					<feGaussianBlur
						stdDeviation="2"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="SourceGraphic"
						edgeMode="none"
						result="blur"
					></feGaussianBlur>
				</filter>
				<clipPath id="1752500502767-6164915_book-open_clipPath_99y0rffwb">
					<path
						d="M17.1058 2.86537C18.4374 2.56947 19.1032 2.42152 19.6257 2.59361C20.0838 2.74451 20.472 3.05589 20.7187 3.47039C21 3.94312 21 4.62513 21 5.98917L21 14.4331C21 15.349 21 15.807 20.8377 16.1849C20.6945 16.5182 20.4634 16.8063 20.1691 17.0184C19.8354 17.2588 19.3883 17.3582 18.4942 17.5568L12.3471 18.9229C12.2176 18.9517 12.1528 18.966 12.0874 18.9718C12.0292 18.9769 11.9708 18.9769 11.9126 18.9718C11.8472 18.966 11.7824 18.9517 11.6529 18.9229L5.50582 17.5568C4.6117 17.3582 4.16464 17.2588 3.83093 17.0184C3.53658 16.8063 3.30545 16.5182 3.1623 16.1849C3 15.8069 3 15.349 3 14.4331L3 5.98917C3 4.62513 3 3.94312 3.28134 3.47039C3.52803 3.05589 3.9162 2.74451 4.37434 2.59361C4.89684 2.42152 5.56262 2.56947 6.89418 2.86537L11.6529 3.92287C11.7824 3.95165 11.8472 3.96604 11.9126 3.97178C11.9708 3.97688 12.0292 3.97688 12.0874 3.97178C12.1528 3.96604 12.2176 3.95165 12.3471 3.92287L17.1058 2.86537Z"
						fill="url(#1752500502767-6164915_book-open_existing_1_gwnxwxu1a)"
					></path>
				</clipPath>
				<mask id="1752500502767-6164915_book-open_mask_0lsha4amw">
					<rect width="100%" height="100%" fill="#FFF"></rect>
					<path
						d="M17.1058 2.86537C18.4374 2.56947 19.1032 2.42152 19.6257 2.59361C20.0838 2.74451 20.472 3.05589 20.7187 3.47039C21 3.94312 21 4.62513 21 5.98917L21 14.4331C21 15.349 21 15.807 20.8377 16.1849C20.6945 16.5182 20.4634 16.8063 20.1691 17.0184C19.8354 17.2588 19.3883 17.3582 18.4942 17.5568L12.3471 18.9229C12.2176 18.9517 12.1528 18.966 12.0874 18.9718C12.0292 18.9769 11.9708 18.9769 11.9126 18.9718C11.8472 18.966 11.7824 18.9517 11.6529 18.9229L5.50582 17.5568C4.6117 17.3582 4.16464 17.2588 3.83093 17.0184C3.53658 16.8063 3.30545 16.5182 3.1623 16.1849C3 15.8069 3 15.349 3 14.4331L3 5.98917C3 4.62513 3 3.94312 3.28134 3.47039C3.52803 3.05589 3.9162 2.74451 4.37434 2.59361C4.89684 2.42152 5.56262 2.56947 6.89418 2.86537L11.6529 3.92287C11.7824 3.95165 11.8472 3.96604 11.9126 3.97178C11.9708 3.97688 12.0292 3.97688 12.0874 3.97178C12.1528 3.96604 12.2176 3.95165 12.3471 3.92287L17.1058 2.86537Z"
						fill="#000"
					></path>
				</mask>
			</defs>
		</g>
	</svg>
);

const SupportIcon = (
	<svg
		className="size-6 inline-flex"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<g fill="none">
			<path
				d="M10 18.0098V18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18V18.0098C14 19.1143 13.1046 20.0098 12 20.0098C10.8954 20.0098 10 19.1143 10 18.0098ZM13 9.5C13 8.94772 12.5523 8.5 12 8.5C11.4477 8.5 11 8.94772 11 9.5C11 10.6046 10.1046 11.5 9 11.5C7.89543 11.5 7 10.6046 7 9.5C7 6.73858 9.23858 4.5 12 4.5C14.7614 4.5 17 6.73858 17 9.5C17 11.3954 15.9442 13.0415 14.3984 13.8877C14.2927 13.9456 14.1982 14.0068 14.1201 14.0664C14.0611 14.1114 14.0192 14.1508 13.9902 14.1807C13.8988 15.2005 13.0436 16 12 16C10.8954 16 10 15.1046 10 14C10 12.9774 10.4464 12.1659 10.9287 11.6035C11.4024 11.0512 11.9791 10.6523 12.4785 10.3789C12.7936 10.2062 13 9.87572 13 9.5Z"
				fill="url(#1752500502776-6922995_circle-question_existing_0_u1lnsasju)"
				data-glass="origin"
				mask="url(#1752500502776-6922995_circle-question_mask_asjsfuc3h)"
			></path>
			<path
				d="M10 18.0098V18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18V18.0098C14 19.1143 13.1046 20.0098 12 20.0098C10.8954 20.0098 10 19.1143 10 18.0098ZM13 9.5C13 8.94772 12.5523 8.5 12 8.5C11.4477 8.5 11 8.94772 11 9.5C11 10.6046 10.1046 11.5 9 11.5C7.89543 11.5 7 10.6046 7 9.5C7 6.73858 9.23858 4.5 12 4.5C14.7614 4.5 17 6.73858 17 9.5C17 11.3954 15.9442 13.0415 14.3984 13.8877C14.2927 13.9456 14.1982 14.0068 14.1201 14.0664C14.0611 14.1114 14.0192 14.1508 13.9902 14.1807C13.8988 15.2005 13.0436 16 12 16C10.8954 16 10 15.1046 10 14C10 12.9774 10.4464 12.1659 10.9287 11.6035C11.4024 11.0512 11.9791 10.6523 12.4785 10.3789C12.7936 10.2062 13 9.87572 13 9.5Z"
				fill="url(#1752500502776-6922995_circle-question_existing_0_u1lnsasju)"
				data-glass="clone"
				filter="url(#1752500502776-6922995_circle-question_filter_l7zis7cov)"
				clipPath="url(#1752500502776-6922995_circle-question_clipPath_puua9pgph)"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 16.5C11.3096 16.5 10.75 17.0596 10.75 17.75V17.7598C10.75 18.4501 11.3096 19.0098 12 19.0098C12.6904 19.0098 13.25 18.4501 13.25 17.7598V17.75C13.25 17.0596 12.6904 16.5 12 16.5ZM12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 10.0523 8.44772 10.5 9 10.5C9.55229 10.5 10 10.0523 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5C14 10.2557 13.5809 10.9149 12.958 11.2559C12.5267 11.492 12.0587 11.8211 11.6875 12.2539C11.3119 12.6918 11 13.2816 11 14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14C13 13.89 13.0442 13.7454 13.2061 13.5566C13.3724 13.3627 13.6236 13.1724 13.9189 13.0107C15.157 12.3329 16 11.0155 16 9.5C16 7.29086 14.2091 5.5 12 5.5Z"
				fill="url(#1752500502776-6922995_circle-question_existing_1_nny9n79av)"
				data-glass="blur"
			></path>
			<path
				d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 1.75C6.33908 1.75 1.75 6.33908 1.75 12C1.75 17.6609 6.33908 22.25 12 22.25C17.6609 22.25 22.25 17.6609 22.25 12C22.25 6.33908 17.6609 1.75 12 1.75Z"
				fill="url(#1752500502776-6922995_circle-question_existing_2_17m4uevwf)"
			></path>
			<defs>
				<linearGradient
					id="1752500502776-6922995_circle-question_existing_0_u1lnsasju"
					x1="12"
					y1="4.5"
					x2="12"
					y2="20.01"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#575757"></stop>
					<stop offset="1" stopColor="#151515"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502776-6922995_circle-question_existing_1_nny9n79av"
					x1="12"
					y1="1"
					x2="12"
					y2="23"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#E3E3E5" stopOpacity=".6"></stop>
					<stop offset="1" stopColor="#BBBBC0" stopOpacity=".6"></stop>
				</linearGradient>
				<linearGradient
					id="1752500502776-6922995_circle-question_existing_2_17m4uevwf"
					x1="12"
					y1="1"
					x2="12"
					y2="13.74"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#fff"></stop>
					<stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
				</linearGradient>
				<filter
					id="1752500502776-6922995_circle-question_filter_l7zis7cov"
					x="-100%"
					y="-100%"
					width="400%"
					height="400%"
					filterUnits="objectBoundingBox"
					primitiveUnits="userSpaceOnUse"
				>
					<feGaussianBlur
						stdDeviation="2"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="SourceGraphic"
						edgeMode="none"
						result="blur"
					></feGaussianBlur>
				</filter>
				<clipPath id="1752500502776-6922995_circle-question_clipPath_puua9pgph">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 16.5C11.3096 16.5 10.75 17.0596 10.75 17.75V17.7598C10.75 18.4501 11.3096 19.0098 12 19.0098C12.6904 19.0098 13.25 18.4501 13.25 17.7598V17.75C13.25 17.0596 12.6904 16.5 12 16.5ZM12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 10.0523 8.44772 10.5 9 10.5C9.55229 10.5 10 10.0523 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5C14 10.2557 13.5809 10.9149 12.958 11.2559C12.5267 11.492 12.0587 11.8211 11.6875 12.2539C11.3119 12.6918 11 13.2816 11 14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14C13 13.89 13.0442 13.7454 13.2061 13.5566C13.3724 13.3627 13.6236 13.1724 13.9189 13.0107C15.157 12.3329 16 11.0155 16 9.5C16 7.29086 14.2091 5.5 12 5.5Z"
						fill="url(#1752500502776-6922995_circle-question_existing_1_nny9n79av)"
					></path>
				</clipPath>
				<mask id="1752500502776-6922995_circle-question_mask_asjsfuc3h">
					<rect width="100%" height="100%" fill="#FFF"></rect>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 16.5C11.3096 16.5 10.75 17.0596 10.75 17.75V17.7598C10.75 18.4501 11.3096 19.0098 12 19.0098C12.6904 19.0098 13.25 18.4501 13.25 17.7598V17.75C13.25 17.0596 12.6904 16.5 12 16.5ZM12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 10.0523 8.44772 10.5 9 10.5C9.55229 10.5 10 10.0523 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5C14 10.2557 13.5809 10.9149 12.958 11.2559C12.5267 11.492 12.0587 11.8211 11.6875 12.2539C11.3119 12.6918 11 13.2816 11 14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14C13 13.89 13.0442 13.7454 13.2061 13.5566C13.3724 13.3627 13.6236 13.1724 13.9189 13.0107C15.157 12.3329 16 11.0155 16 9.5C16 7.29086 14.2091 5.5 12 5.5Z"
						fill="#000"
					></path>
				</mask>
			</defs>
		</g>
	</svg>
);
