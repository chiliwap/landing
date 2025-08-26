import type { Metadata, ResolvingMetadata } from "next";

import Renderer from "@/markdown/mdx-render";

const articleMeta: Record<string, { title: string; description: string }> = {
	"firefighting-with-foresight": {
		title: "Firefighting with Foresight | Chiliwap",
		description:
			"Explore how Chiliwap's wildfire soaking system uses foresight and automation to protect homes and communities.",
	},
	"a-builders-perspective": {
		title: "A Builder's Perspective | Chiliwap",
		description:
			"Gain insights from builders on wildfire resilience and the role of smart soaking systems in modern construction.",
	},
};

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { slug } = await params;

	const meta = articleMeta[slug] || {
		title: "Article | Chiliwap",
		description: "Read the latest insights and stories from Chiliwap.",
	};
	return {
		title: meta.title,
		description: meta.description,
	};
}

export default async function Article({ params, searchParams }: Props) {
	const { slug } = await params;

	return <Renderer slug={slug} />;
}

export function generateStaticParams() {
	return [
		{ slug: "firefighting-with-foresight" },
		{ slug: "a-builders-perspective" },
	];
}

export const dynamicParams = false;
