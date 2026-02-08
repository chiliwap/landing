import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authenticateUser, createSession } from "@/lib/dal";
import { rateLimit } from "@/lib/helpers/ratelimit";
import { auditLog } from "@/lib/helpers/audit-log";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = (body.email || "").toString().trim().toLowerCase();
        const password = (body.password || "").toString();

        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required",
            }, { status: 400 });
        }

        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            hdrs.get("x-real-ip")?.trim() || "unknown";

        // Rate limit by IP+email (prevents brute-force from a single IP)
        const ipKey = `auth:login:${ip}:${email}`;
        const ipRl = await rateLimit(ipKey, { windowMs: 60_000, limit: 6 });
        if (!ipRl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        // Rate limit by email only (prevents distributed brute-force across IPs)
        const emailKey = `auth:login:email:${email}`;
        const emailRl = await rateLimit(emailKey, { windowMs: 300_000, limit: 15 });
        if (!emailRl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        const result = await authenticateUser(email, password);

        if (result.error === "locked_out") {
            auditLog({ event: "login_locked_out", email, ip });
            const minutes = Math.ceil(result.retryAfter / 60);
            return NextResponse.json({
                error: `Account temporarily locked. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
                code: "account_locked",
            }, { status: 423 });
        }

        if (result.error) {
            auditLog({ event: "login_failed", email, ip });
            return NextResponse.json({ error: "Incorrect email or password" }, {
                status: 401,
            });
        }

        const user = result.user;

        // Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json({
                error: "Please verify your email before signing in",
                code: "email_not_verified",
            }, { status: 403 });
        }

        // Check if account has expired (unverified account TTL)
        if (user.expireAt && Math.floor(Date.now() / 1000) > user.expireAt) {
            return NextResponse.json({
                error: "Your account has expired. Please sign up again.",
                code: "account_expired",
            }, { status: 403 });
        }

        // Create iron-session
        await createSession(user.id, user.email, user.name);

        auditLog({ event: "login_success", email, userId: user.id, ip });
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("password login error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
