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

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const meta = articleMeta[params.slug] || {
		title: "Article | Chiliwap",
		description: "Read the latest insights and stories from Chiliwap.",
	};
	return {
		title: meta.title,
		description: meta.description,
	};
}

export default async function Article({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
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
