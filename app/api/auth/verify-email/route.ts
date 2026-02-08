import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
    createEmailVerificationToken,
    verifyEmailToken,
} from "@/lib/dal/email-verification";
import { createSession, getUserById } from "@/lib/dal";
import { dynamodb, USERS_TABLE } from "@/lib/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { rateLimit } from "@/lib/helpers/ratelimit";
import { auditLog } from "@/lib/helpers/audit-log";

export async function POST(request: NextRequest) {
    try {
        // Rate limit by IP
        const hdrs = await headers();
        const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            hdrs.get("x-real-ip")?.trim() || "unknown";
        const key = `auth:verify-email:${ip}`;
        const rl = await rateLimit(key, { windowMs: 60_000, limit: 10 });
        if (!rl.ok) {
            return NextResponse.json({ error: "Too many requests" }, {
                status: 429,
            });
        }

        const body = await request.json();
        const token = (body.token || "").toString();

        if (!token) {
            return NextResponse.json({
                error: "Verification token is required",
            }, { status: 400 });
        }

        // Verify the email token
        const verificationRecord = await verifyEmailToken(token);
        if (!verificationRecord) {
            return NextResponse.json({
                error: "Invalid or expired verification token",
            }, { status: 400 });
        }

        // Update user as verified and remove TTL
        await dynamodb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id: verificationRecord.userId },
                UpdateExpression:
                    "SET #verified = :true, #verifiedAt = :now, #updated = :now REMOVE expireAt",
                ExpressionAttributeNames: {
                    "#verified": "emailVerified",
                    "#verifiedAt": "emailVerifiedAt",
                    "#updated": "updatedAt",
                },
                ExpressionAttributeValues: {
                    ":true": true,
                    ":now": new Date().toISOString(),
                },
            }),
        );

        // Get user and create session
        const user = await getUserById(verificationRecord.userId);
        if (!user) {
            return NextResponse.json({
                error: "User not found",
            }, { status: 400 });
        }

        // Create iron-session
        await createSession(user.id, user.email, user.name);

        auditLog({ event: "email_verified", email: user.email, userId: user.id });
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("email verification error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
