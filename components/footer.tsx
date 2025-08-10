import Link from "next/link";

export default function Footer(props: {
  className?: string;
  variant?: "large" | "small";
}) {
  return (
    <>
      {props.variant === "small" ? (
        <footer className="z-20 text-center text-sm text-neutral-500">
          <p className="absolute bottom-12 left-12">
            Imagine a home that protects itself.
          </p>

          <p className="absolute bottom-12 right-12">
            &copy; {new Date().getFullYear()} Chiliwap. All rights reserved.
          </p>
        </footer>
      ) : (
        <footer
          className={`text-gray-200 text-xs font-bold mt-8 pb-6 bg-neutral-900 ${
            props.className ?? ""
          }`}
        >
          <div className="rounded-b-[4rem] bg-(--background) h-24 w-full" />

          <div className="z-20 max-w-6xl mx-auto h-64 flex flex-col sm:flex-row justify-center items-center gap-12 text-white">
            <Link href="/about">Chiliwap © 2025</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/support">Support</Link>
            <Link href="/news">News</Link>
            <Link href="/updates">Get Updates</Link>
            <Link href="/location">Location</Link>
          </div>
        </footer>
      )}
    </>
  );
}
