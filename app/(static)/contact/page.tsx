import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import ContactForm from "@/components/forms/contact-form";
import { submitContact } from "@/components/forms/actions/contact";

export const metadata = {
  title: "Contact Us | Chiliwap",
  description:
    "Get in touch with Chiliwap for questions, support, or project inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Nav />
      <section className="relative h-full w-full flex flex-col items-center justify-center">
        <header className="text-center mt-32 space-y-6">
          <h1 className="text-4xl logo-text">Contact Us</h1>
          <p className="max-w-2xl">
            We&apos;d love to hear from you. Send us a note and we&apos;ll get
            back as soon as we can.
          </p>
        </header>
        <div className="w-full max-w-4xl px-8 py-16 relative">
          <ContactForm action={submitContact} />
          <div className="mt-8 text-center text-sm text-neutral-500">
            Prefer email? Write us at{" "}
            <a className="underline" href="mailto:info@chiliwap.ca">
              info@chiliwap.ca
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
