import Renderer from "@/markdown/mdx-render";

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
