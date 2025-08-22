import Footer from "@/components/layout/footer";
import Gradient from "@/components/ui/mouse-gradient";
import Nav from "@/components/layout/nav";

export default function ArticleLayout(props: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      <Nav />
      <article className="relative w-full prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-white prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-p:text-neutral-500">
        {props.children}
      </article>

      <Gradient />

      <Footer />
    </main>
  );
}
