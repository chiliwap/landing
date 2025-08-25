"use client";

import dynamic from "next/dynamic";

export default function Renderer(props: { slug: string }) {
  const Post = dynamic(() => import(`@/content/${props.slug}.mdx`), {
    ssr: false,
  });

  return <Post />;
}
