"use client";
import { ReactNode, useEffect } from "react";

export default function Modal({
	open,
	onClose,
	children,
}: {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}) {
	useEffect(() => {
		if (!open) return;
		const handle = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, [open, onClose]);

	if (!open) return null;
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative bg-neutral-950 rounded-xl shadow-xl p-6 max-w-lg w-full mx-4"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-neutral-400 hover:text-white text-xl"
					aria-label="Close modal"
				>
					×
				</button>
				{children}
			</div>
		</div>
	);
}
