import { NextResponse } from "next/server";

type BetterStatusResponse = {
    data?: {
        attributes?: {
            aggregate_state?: string;
        };
    };
};

function mapStatusToColor(state: string) {
    const s = state.toLowerCase();
    if (s.includes("operational")) return "bg-emerald-400";
    if (s.includes("downtime")) return "bg-red-400";
    if (s.includes("degraded")) return "bg-amber-400";
    if (s.includes("maintenance")) return "bg-blue-400";
    return "bg-neutral-400";
}

export async function GET() {
    try {
        const upstream = await fetch(
            "https://betteruptime.com/api/v2/status-pages/224103",
            {
                headers: {
                    Authorization: `Bearer ${process.env
                        .BETTER_STACK_API_KEY!}`,
                },
                // Cache on the server for 5 minutes, allow 1 minute stale while revalidating
                next: { revalidate: 300 },
            },
        );

        if (!upstream.ok) {
            return NextResponse.json(
                { error: "Failed to fetch status" },
                { status: upstream.status },
            );
        }

        const data = (await upstream.json()) as BetterStatusResponse;
        const status = (data?.data?.attributes?.aggregate_state ?? "Unknown")
            .replace(/^./, (c) => c.toUpperCase());
        const color = mapStatusToColor(status);

        const res = NextResponse.json(
            { status, color },
            { status: 200 },
        );
        // Extra cache headers for CDNs (optional)
        res.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=60",
        );
        return res;
    } catch (err) {
        return NextResponse.json({ error: "Unexpected error" }, {
            status: 500,
        });
    }
}
