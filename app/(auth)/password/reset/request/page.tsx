"use client";

import React from "react";
import PasswordResetRequest from "@/components/forms/password-reset-request";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import Gradient from "@/components/ui/mouse-gradient";
import Link from "next/link";

export default function PasswordResetRequestPage() {
	return (
		<main>
			<div className="relative min-h-screen">
				<Nav />

				<div className="z-20 absolute inset-0 flex flex-col items-center justify-center h-[86vh] w-full px-4">
					<h2 className="text-2xl mb-6 logo-text">Reset your password</h2>
					<p className="text-sm text-neutral-400 mb-4 text-center max-w-sm">
						Enter your email to receive a password reset link.
					</p>
					<PasswordResetRequest />
					<p className="text-sm text-neutral-400 mt-6">
						Remembered it?{" "}
						<Link href="/login" className="text-orange-500 hover:underline">
							Back to sign in
						</Link>
					</p>
				</div>

				<Gradient />
			</div>

			<Footer variant="small" />
		</main>
	);
}
