import { NextResponse } from "next/server";

export async function POST() {
    // TODO: Implement Stripe SetupIntent creation
    return NextResponse.json(
        { error: "Not implemented" },
        { status: 501 },
    );
}
