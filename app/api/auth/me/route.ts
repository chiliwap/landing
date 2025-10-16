import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import { getSessionFromCookies, validateSession } from "@/lib/auth";

export async function GET() {
    const sessionCookie = await getSessionFromCookies();
    if (!sessionCookie) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const valid = await validateSession(sessionCookie.token);
    if (!valid) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: valid.user });
}
