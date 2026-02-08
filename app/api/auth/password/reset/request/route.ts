import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { render } from "@react-email/render";
import Plunk from "@plunk/node";
import React from "react";
import { createMagicLink, getUserByEmail } from "@/lib/dal";
import { rateLimit } from "@/lib/helpers/ratelimit";
import { auditLog } from "@/lib/helpers/audit-log";
import PasswordResetEmail from "@/components/mail/password-reset";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = (body.email || "").toString().trim().toLowerCase();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, {
                status: 400,
            });
        }

        const emailRegex = /^[^\s@]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, {
                status: 400,
            });
        }

        // rate limit
        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            hdrs.get("x-real-ip")?.trim() || "unknown";
        const key = `auth:pwreset:${ip}:${email}`;
        const rl = await rateLimit(key, { windowMs: 60_000, limit: 3 });
        if (!rl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            // don't reveal account existence
            return NextResponse.json({ ok: true });
        }

        auditLog({ event: "password_reset_requested", email, ip });
        const magicLink = await createMagicLink(
            user.email,
            "/auth/password/reset/verify",
            15,
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
            new URL(request.url).origin;
        const resetUrl = `${baseUrl}/password/reset?token=${
            encodeURIComponent(magicLink.token)
        }`;
        const html = await render(
            React.createElement(PasswordResetEmail, { resetUrl }),
        );

        const apiKey = process.env.PLUNK_API_KEY;
        if (!apiKey) {
            if (process.env.NODE_ENV !== "production") {
                // console.log("Dev password reset link:", resetUrl);
            }
            return NextResponse.json({ ok: true });
        }

        const plunk = new Plunk(apiKey);
        await plunk.emails.send({
            name: "Chiliwap",
            to: user.email,
            subject: "Password reset",
            body: html,
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("password reset request error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
