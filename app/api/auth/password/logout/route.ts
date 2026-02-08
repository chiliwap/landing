import { type NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/dal";

export async function POST(_request: NextRequest) {
    try {
        await destroySession();
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("password logout error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
