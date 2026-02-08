import { type NextRequest, NextResponse } from "next/server";
import {
    consumeMagicLink,
    destroySession,
    getUserByEmail,
    updateUserPassword,
} from "@/lib/dal";
import { validatePassword } from "@/lib/validators/password";
import { auditLog } from "@/lib/helpers/audit-log";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const token = (body.token || "").toString();
        const newPassword = (body.password || "").toString();

        if (!token || !newPassword) {
            return NextResponse.json({
                error: "Token and new password are required",
            }, { status: 400 });
        }

        // Validate password complexity
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return NextResponse.json({
                error: passwordValidation.errors[0] ||
                    "Password does not meet requirements",
            }, { status: 400 });
        }

        const rec = await consumeMagicLink(token);
        if (!rec) {
            return NextResponse.json({ error: "Invalid or expired token" }, {
                status: 400,
            });
        }

        const user = await getUserByEmail(rec.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, {
                status: 400,
            });
        }

        const ok = await updateUserPassword(user.id, newPassword);
        if (!ok) {
            return NextResponse.json({ error: "Failed to set password" }, {
                status: 500,
            });
        }

        auditLog({ event: "password_reset_completed", email: rec.email, userId: user.id });

        // Destroy current session so user must log in with new password
        await destroySession();

        return NextResponse.json({
            ok: true,
            message:
                "Password changed successfully. Please sign in with your new password.",
        });
    } catch (e) {
        console.error("password reset verify error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
