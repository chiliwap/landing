"use server";

import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import ContactSubmission from "@/components/mail/contact-submission";
import { rateLimit } from "@/lib/helpers/ratelimit";
import { headers } from "next/headers";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

export async function submitContact(
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Honeypot field: if filled, treat as spam but respond success
    const honeypot = (formData.get("company") || "").toString().trim();
    if (honeypot) {
      return { ok: true };
    }

    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const subject = (formData.get("subject") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      return {
        ok: false,
        error: "Please provide your name, email, and a message.",
      };
    }

    // Basic email guard
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { ok: false, error: "Please provide a valid email address." };
    }

    // Rate limit (e.g., 5 requests per 10 minutes per IP)
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip")?.trim() ||
      "unknown";
    const key = `contact:${ip || email}`;
    const rl = await rateLimit(key, { windowMs: 10 * 60 * 1000, limit: 5 });
    if (!rl.ok) {
      return {
        ok: false,
        error: "Too many messages from your network. Please try again later.",
      };
    }

    const body = await render(
      <ContactSubmission
        baseURL={process.env.NEXT_PUBLIC_BASE_URL || "https://chiliwap.ca"}
        name={name}
        email={email}
        phone={phone || undefined}
        subject={subject || undefined}
        message={message}
      />
    );

    const apiKey = process.env.PLUNK_API_KEY;
    if (!apiKey) {
      console.error("PLUNK_API_KEY is not set");
      return {
        ok: false,
        error: "Email service is not configured. Please try again later.",
      };
    }

    const plunk = new Plunk(apiKey);

    await plunk.emails.send({
      name: "Website Contact",
      to: "info@chiliwap.ca",
      subject: subject || `New contact from ${name}`,
      body,
    });

    return { ok: true };
  } catch (err: any) {
    console.error("submitContact error", err);
    return {
      ok: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
