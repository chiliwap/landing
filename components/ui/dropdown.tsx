"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Dropdown(props: {
	thumbnail: string;
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<motion.div className="inline-block text-left text-neutral-300">
			<div onClick={() => setIsOpen(!isOpen)}>
				<img
					src={props.thumbnail}
					alt="User Thumbnail"
					className="size-8 rounded-full cursor-pointer"
				/>
			</div>

			{/* Dropdown menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						animate={{ opacity: 1, scale: 1 }}
						initial={{ opacity: 0, scale: 0.95 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						className="origin-top-right absolute right-4 mt-2 p-3 w-42 rounded-lg shadow-lg bg-neutral-900/80 backdrop-blur-md z-50 flex flex-col space-y-4"
					>
						{props.children}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

// Compact custom select component to replace native <select>
export function CompactSelect(props: {
	id?: string;
	icon?: { [key: string]: React.ReactNode };
	value: string;
	onChange: (v: string) => void;
	options: { value: string; label: string }[];
	className?: string;
	placeholder?: string;
	ariaLabel?: string;
}) {
	const {
		id,
		icon,
		value,
		onChange,
		options,
		className,
		placeholder,
		ariaLabel,
	} = props;
	const [open, setOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState<number>(() =>
		Math.max(
			0,
			options.findIndex((o) => o.value === value)
		)
	);
	const wrapRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!wrapRef.current) return;
			if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);

	React.useEffect(() => {
		setActiveIndex(
			Math.max(
				0,
				options.findIndex((o) => o.value === value)
			)
		);
	}, [value, options]);

	const selected = options.find((o) => o.value === value);
	const label = selected?.label ?? placeholder ?? "Select";

	return (
		<div ref={wrapRef} className="relative">
			<button
				id={id}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label={ariaLabel}
				onClick={() => setOpen((o) => !o)}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
						setActiveIndex((i) => Math.min(options.length - 1, i + 1));
					} else if (e.key === "ArrowUp") {
						e.preventDefault();
						setOpen(true);
						setActiveIndex((i) => Math.max(0, i - 1));
					} else if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (open) {
							const opt = options[activeIndex];
							if (opt) onChange(opt.value);
						}
						setOpen((o) => !o);
					} else if (e.key === "Escape") {
						setOpen(false);
					}
				}}
				className={`${
					className ? className : ""
				} w-full flex items-center gap-3 rounded-md bg-black/20 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600`}
			>
				<span className="inline-block [&_svg]:w-6 [&_svg]:h-6">
					{icon ? icon[value] : null}
				</span>
				<span className="text-sm">{label}</span>
				<span className="ml-auto text-neutral-400">▾</span>
				{/* <span className="truncate">{label}</span>
				<svg
					className="ml-2 h-3.5 w-3.5 opacity-80"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden
				>
					<path
						fillRule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
						clipRule="evenodd"
					/>
				</svg> */}
			</button>
			{open && (
				<ul
					role="listbox"
					aria-labelledby={id}
					className="absolute z-50 left-0 right-0 top-full mt-1 rounded-lg border border-white/15 bg-neutral-900 shadow-xl max-h-64 overflow-auto"
				>
					{options.map((opt, i) => {
						const isActive = i === activeIndex;
						const isSelected = opt.value === value;
						return (
							<li
								key={opt.value}
								role="option"
								aria-selected={isSelected}
								onMouseEnter={() => setActiveIndex(i)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
									onChange(opt.value);
									setOpen(false);
								}}
								className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
									isActive ? "bg-neutral-800" : "bg-transparent"
								} ${isSelected ? "text-white" : "text-white/80"}`}
							>
								<span className="inline-block [&_svg]:w-6 [&_svg]:h-6">
									{icon ? icon[opt.value] : null}
								</span>
								<span>{opt.label}</span>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
