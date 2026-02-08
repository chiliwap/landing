import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { destroySession } from "@/lib/dal";

export async function POST(request: NextRequest) {
    // CSRF protection: validate Origin header
    const hdrs = await headers();
    const origin = hdrs.get("origin");
    const host = hdrs.get("host");

    if (origin && host) {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    await destroySession();
    return NextResponse.json({ ok: true });
}
