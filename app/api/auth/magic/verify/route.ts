import { type NextRequest, NextResponse } from "next/server";
import {
    buildSessionCookie,
    consumeMagicToken,
    createEmailUser,
    createSession,
    findUserByEmail,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const token = searchParams.get("token") || "";
    if (!token) {
        return NextResponse.redirect(
            new URL("/login?error=missing_token", origin),
        );
    }

    const rec = await consumeMagicToken(token);
    if (!rec) {
        return NextResponse.redirect(
            new URL("/login?error=invalid_or_expired", origin),
        );
    }

    let user = await findUserByEmail(rec.email);
    if (!user) {
        user = await createEmailUser(rec.email);
    }

    const session = await createSession(user);
    const cookie = buildSessionCookie(session);

    const redirectTo = rec.redirectPath || "/dashboard";
    const response = NextResponse.redirect(new URL(redirectTo, origin));
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
}
