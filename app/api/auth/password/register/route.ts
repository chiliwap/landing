import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
    createEmailVerificationToken,
    createUser,
    getUserByEmail,
} from "@/lib/dal";
import { rateLimit } from "@/lib/helpers/ratelimit";
import { auditLog } from "@/lib/helpers/audit-log";
import { validatePassword } from "@/lib/validators/password";
import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import VerificationEmail from "@/components/mail/verification";
import React from "react";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = (body.email || "").toString().trim().toLowerCase();
        const password = (body.password || "").toString();
        const name = (body.name || "").toString().trim();

        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required",
            }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, {
                status: 400,
            });
        }

        // Validate password complexity
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json({
                error: passwordValidation.errors[0] ||
                    "Password does not meet requirements",
            }, { status: 400 });
        }

        // rate limit by IP+email
        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            hdrs.get("x-real-ip")?.trim() || "unknown";
        const key = `auth:register:${ip}:${email}`;
        const rl = await rateLimit(key, { windowMs: 60_000, limit: 5 });
        if (!rl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        // ensure not already registered
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: "Account already exists" }, {
                status: 409,
            });
        }

        // Create user (not verified yet) with TTL for unverified account (48 hours)
        const expireAt = Math.floor(Date.now() / 1000) + 48 * 60 * 60;
        const user = await createUser(
            email,
            password,
            name || undefined,
            { expireAt },
        );

        // Create email verification token
        const verificationToken = await createEmailVerificationToken(
            user.id,
            email,
        );

        // Send verification email
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
            new URL(request.url).origin;
        const verifyUrl = `${baseUrl}/auth/verify-email?token=${
            encodeURIComponent(verificationToken.token)
        }`;

        const html = await render(
            React.createElement(VerificationEmail, { verifyUrl }),
        );

        const apiKey = process.env.PLUNK_API_KEY;
        if (apiKey) {
            const plunk = new Plunk(apiKey);
            await plunk.emails.send({
                name: "Chiliwap",
                to: user.email,
                subject: "Verify your email",
                body: html,
            });
        } else if (process.env.NODE_ENV !== "production") {
            // console.log("Dev verification link:", verifyUrl);
        }

        auditLog({ event: "account_created", email, userId: user.id, ip });
        return NextResponse.json({
            ok: true,
            message: "Account created. Please check your email to verify.",
        });
    } catch (e) {
        console.error("password register error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
