import { NextResponse } from "next/server";
import { getUserById, verifySession } from "@/lib/dal";

export async function GET() {
    const session = await verifySession();

    if (!session || !session.userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch fresh user data from database
    const user = await getUserById(session.userId);

    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
}
