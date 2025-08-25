"use client";

import Link from "next/link";
import Newsletter from "@/components/forms/newsletter";

import { useState, useEffect } from "react";

export default function Footer(props: {
	className?: string;
	variant?: "large" | "small";
}) {
	// call better stack api and get system status text
	const [status, setStatus] = useState<string>("Loading...");
	const [color, setColor] = useState<string>("");

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await fetch("/api/status", { cache: "no-store" });
				if (!response.ok) throw new Error("Failed to load status");
				const res = await response.json();
				setStatus(res.status ?? "Unknown");
				setColor(res.color ?? "bg-neutral-400");
			} catch (e) {
				setStatus("Unknown");
				setColor("bg-neutral-400");
			}
		};

		fetchStatus();
	}, []);

	return (
		<>
			{props.variant === "small" ? (
				<footer className="z-20 absolute bottom-0 left-0 w-full text-center text-sm text-neutral-500 px-4 py-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-2 mx-12">
						<p className="order-1 md:order-none">
							Imagine a home that protects itself.
						</p>
						<p className="order-2 md:order-none">
							&copy; {new Date().getFullYear()} Chiliwap. All rights reserved.
						</p>
					</div>
				</footer>
			) : (
				<footer
					className={`relative overflow-hidden text-gray-200 text-xs mt-8 pb-6 bg-stone-900/60 noise ${
						props.className ?? ""
					}`}
				>
					<div className="md:rounded-b-[5rem] rounded-b-[3rem] bg-(--background) h-24 w-full" />

					{/* 4 columns layout */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto mt-12 mb-24">
						<div className="md:flex md:flex-col place-content-center">
							<img
								src="/logo.png"
								alt="Chiliwap Logo"
								className="size-20 mb-2"
							/>
						</div>

						<div className="flex flex-col space-y-1 group">
							<h5 className="font-bold text-xl mb-3">Company</h5>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/about"
							>
								About
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/news"
							>
								News
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="mailto:info@chiliwap.ca"
							>
								Careers
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/contact"
							>
								Contact
							</Link>
						</div>
						<div className="flex flex-col space-y-1 group">
							<h5 className="font-bold text-xl mb-3">Quick Links</h5>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/dashboard"
							>
								Dashboard
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/products"
							>
								Virtual Consultation
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/support"
							>
								Support
							</Link>
						</div>
						<div className="flex flex-col space-y-1 group">
							<h5 className="font-bold text-xl mb-3">Legal</h5>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/privacy"
							>
								Privacy Policy
							</Link>
							<Link
								className="text-stone-400 group-hover:text-stone-300 hover:text-stone-500 transition-colors duration-200"
								href="/terms"
							>
								Terms of Service
							</Link>
						</div>
					</div>

					<div className="flex flex-col items-center justify-center mt-12">
						<div className="-mb-10 hidden md:block">
							<Newsletter className="mb-4" />
							<h4 className="tracking-widest text-center logo-text text-6xl">
								CHILIWAP
							</h4>
						</div>
						<div className="md:hidden w-full px-4">
							<Newsletter className="mb-4" />
							<h4 className="tracking-widest text-center logo-text text-4xl">
								CHILIWAP
							</h4>
						</div>
					</div>

					<p className="text-center md:text-right md:absolute md:bottom-6 md:right-10 text-stone-600 text-xs mt-6">
						&copy; {new Date().getFullYear()} Chiliwap. All rights reserved.
					</p>

					{/* Status pill (large variant) */}
					<Link
						href="https://status.chiliwap.ca"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="System status"
						className="md:absolute md:bottom-6 md:left-10 mx-auto mt-6 md:mt-0 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-transparent px-2.5 py-1 text-xs text-white/80 transition-colors hover:border-white/20 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
					>
						<span className={`h-1.5 w-1.5 rounded-full ${color}`} />
						<span>
							Status <span className="text-neutral-400">{status}</span>
						</span>
					</Link>
				</footer>
			)}
		</>
	);
}
