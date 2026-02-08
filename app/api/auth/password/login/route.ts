import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authenticateUser, createSession } from "@/lib/dal";
import { rateLimit } from "@/lib/helpers/ratelimit";

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
        const key = `auth:login:${ip}:${email}`;
        const rl = await rateLimit(key, { windowMs: 60_000, limit: 6 });
        if (!rl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        const user = await authenticateUser(email, password);
        if (!user) {
            return NextResponse.json({ error: "Incorrect email or password" }, {
                status: 401,
            });
        }

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

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("password login error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
