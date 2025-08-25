import Footer from "@/components/layout/footer";
import Gradient from "@/components/ui/mouse-gradient";
import Nav from "@/components/layout/nav";
import Link from "next/link";

export const metadata = {
	title: "News | Chiliwap",
	description: "Get the latest updates and insights from Chiliwap.",
};

const articles = [
	{
		title: "Firefighting with foresight",
		href: "/article/firefighting-with-foresight",
		date: new Date("June 6 2025"),
		image: "/content/firefighting-with-foresight.webp",
	},
	{
		title: "A Builder's Perspective",
		href: "/article/a-builders-perspective",
		date: new Date("Jan 23 2025"),
		image: "/content/a-builders-perspective.jpg",
	},
];

export default function News() {
	const sorted = [...articles].sort(
		(a, b) => b.date.getTime() - a.date.getTime()
	);
	const isSmall = sorted.length <= 3;
	const featured = sorted[0];
	const rest = sorted.slice(1);
	return (
		<main className="min-h-screen text-white">
			<Nav />

			{/* Compact header */}
			<section className="pt-20 md:pt-24">
				<div className="max-w-7xl mx-auto px-4">
					<span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
						News
					</span>
					<h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
						News
					</h1>
					<p className="mt-2 text-white/60 max-w-2xl">
						Product updates, company announcements, and perspectives.
					</p>
				</div>
			</section>

			{isSmall ? (
				// Simple cards grid for small sets
				<section className="mt-6 py-4">
					<div className="max-w-7xl mx-auto px-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{sorted.map((article, i) => (
								<Link
									key={i}
									href={article.href}
									className="group rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-300 overflow-hidden"
								>
									<div className="relative h-44 md:h-48">
										<img
											src={article.image}
											alt={article.title}
											className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
										/>
									</div>
									<div className="p-4">
										<div className="text-xs text-white/60">
											{article.date.toLocaleDateString("en-CA", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</div>
										<h3 className="mt-1 text-lg md:text-xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-white/40">
											{article.title}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			) : (
				<>
					{/* Featured hero */}
					<section className="mt-6">
						<div className="max-w-7xl mx-auto px-4">
							{featured && (
								<Link
									href={featured.href}
									className="group relative block rounded-2xl overflow-hidden"
								>
									<img
										src={featured.image}
										alt={featured.title}
										className="w-full h-[34vh] md:h-[40vh] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
										<div className="flex items-center gap-2 text-xs text-white/80">
											<span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-2 py-0.5">
												Featured
											</span>
											<span>
												{featured.date.toLocaleDateString("en-CA", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
										<h2 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">
											{featured.title}
										</h2>
									</div>
								</Link>
							)}
						</div>
					</section>

					{/* Headlines list */}
					<section className="py-10">
						<div className="max-w-7xl mx-auto px-4">
							{rest.length > 0 && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
									{(() => {
										const mid = Math.ceil(rest.length / 2);
										const left = rest.slice(0, mid);
										const right = rest.slice(mid);
										return (
											<>
												<ol className="divide-y divide-white/10">
													{left.map((article, i) => (
														<li key={i} className="py-4">
															<Link href={article.href} className="group block">
																<div className="flex items-start gap-4">
																	<img
																		src={article.image}
																		alt={article.title}
																		className="hidden sm:block w-20 h-14 rounded object-cover border border-white/10"
																	/>
																	<div className="min-w-0 flex-1">
																		<div className="text-xs text-white/60">
																			{article.date.toLocaleDateString(
																				"en-CA",
																				{
																					year: "numeric",
																					month: "long",
																					day: "numeric",
																				}
																			)}
																		</div>
																		<div className="mt-1 flex items-center gap-2">
																			<h3 className="text-base md:text-lg font-medium tracking-tight">
																				{article.title}
																			</h3>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				viewBox="0 0 20 20"
																				fill="currentColor"
																				className="size-4 opacity-60 group-hover:opacity-100 transition-opacity"
																			>
																				<path
																					fillRule="evenodd"
																					d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
																					clipRule="evenodd"
																				/>
																			</svg>
																		</div>
																	</div>
																</div>
															</Link>
														</li>
													))}
												</ol>
												<ol className="divide-y divide-white/10">
													{right.map((article, i) => (
														<li key={i} className="py-4">
															<Link href={article.href} className="group block">
																<div className="flex items-start gap-4">
																	<img
																		src={article.image}
																		alt={article.title}
																		className="hidden sm:block w-20 h-14 rounded object-cover border border-white/10"
																	/>
																	<div className="min-w-0 flex-1">
																		<div className="text-xs text-white/60">
																			{article.date.toLocaleDateString(
																				"en-CA",
																				{
																					year: "numeric",
																					month: "long",
																					day: "numeric",
																				}
																			)}
																		</div>
																		<div className="mt-1 flex items-center gap-2">
																			<h3 className="text-base md:text-lg font-medium tracking-tight">
																				{article.title}
																			</h3>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				viewBox="0 0 20 20"
																				fill="currentColor"
																				className="size-4 opacity-60 group-hover:opacity-100 transition-opacity"
																			>
																				<path
																					fillRule="evenodd"
																					d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
																					clipRule="evenodd"
																				/>
																			</svg>
																		</div>
																	</div>
																</div>
															</Link>
														</li>
													))}
												</ol>
											</>
										);
									})()}
								</div>
							)}
						</div>
					</section>
				</>
			)}

			<Gradient />

			<Footer variant="small" />
		</main>
	);
}
