import Link from "next/link";

export default function Footer(props: { className?: string }) {
  return (
    <footer
      className={`text-gray-200 text-xs font-bold px-6 pt-8 mb-6 ${props.className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-12">
        <Link href="/about">Chiliwap © 2025</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/news">News</Link>
        <Link href="/updates">Get Updates</Link>
        <Link href="/location">Location</Link>
      </div>
    </footer>
  );
}
