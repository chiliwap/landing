import Renderer from "@/content/mdx-render";

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
    { slug: "man-saves-home-with-garden-hose" },
    { slug: "wildfire-season-2023" },
    { slug: "calgary-severe-water-restrictions" },
    { slug: "atmospheric-river-vancouver" },
    { slug: "bc-insurance" },
    { slug: "a-builders-perspective" },
  ];
}

export const dynamicParams = false;
