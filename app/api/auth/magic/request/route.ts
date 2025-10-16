import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import MagicLinkEmail from "@/components/mail/magic-link";
import React from "react";
import {
    findUserByEmail,
    type MagicLinkRecord,
    storeMagicLink,
} from "@/lib/auth";
import { rateLimit } from "@/lib/helpers/ratelimit";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = (body.email || "").toString().trim().toLowerCase();
        const redirectPath = (body.redirectPath || "/dashboard").toString();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, {
                status: 400,
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, {
                status: 400,
            });
        }

        // rate limit
        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            hdrs.get("x-real-ip")?.trim() ||
            "unknown";
        const key = `magic:${ip}:${email}`;
        const rl = await rateLimit(key, { windowMs: 60_000, limit: 3 });
        if (!rl.ok) {
            return NextResponse.json(
                { error: "Too many requests. Try again soon." },
                { status: 429 },
            );
        }

        // ensure user exists (create lightweight record if not)
        let user = await findUserByEmail(email);
        // if (!user) {
        //     user = await createEmailUser(email);
        // }

        // create token
        const token = `${Math.random().toString(36).slice(2)}${
            Date.now().toString(36)
        }`;
        const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes IN SECONDS
        const record: MagicLinkRecord = {
            token,
            email: user?.email ?? email,
            redirectPath,
            expiresAt,
            createdAt: new Date().toISOString(),
        };
        await storeMagicLink(record);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
            new URL(request.url).origin;

        const verifyUrl = `${baseUrl}/api/auth/magic/verify?token=${
            encodeURIComponent(token)
        }`;
        const html = await render(
            React.createElement(MagicLinkEmail, { signInUrl: verifyUrl }),
        );

        const apiKey = process.env.PLUNK_API_KEY;
        if (!apiKey) {
            // In development, return the link for easy testing
            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    "PLUNK_API_KEY missing. Returning magic link in response for dev.",
                );
                return NextResponse.json({ ok: true, devLink: verifyUrl });
            }
            return NextResponse.json(
                { error: "Email service not configured" },
                { status: 500 },
            );
        }
        const plunk = new Plunk(apiKey);
        await plunk.emails.send({
            name: "Chiliwap",
            to: user?.email ?? email,
            subject: "Your Chiliwap sign-in link",
            body: html,
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("magic request error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
