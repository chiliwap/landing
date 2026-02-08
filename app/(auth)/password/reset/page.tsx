"use client";

import React from "react";
import PasswordReset from "@/components/forms/password-reset";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import Gradient from "@/components/ui/mouse-gradient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPage() {
	const params = useSearchParams();
	const token = params?.get("token");

	return (
		<main>
			<div className="relative min-h-screen">
				<Nav />

				<div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
					<h2 className="text-2xl mb-6 logo-text">Reset password</h2>
					<PasswordReset token={token} />
					<p className="text-sm text-neutral-400 mt-6">
						Back to{" "}
						<Link href="/login" className="text-orange-500 hover:underline">
							Sign in
						</Link>
					</p>
				</div>

				<Gradient />
			</div>

			<Footer variant="small" />
		</main>
	);
}
