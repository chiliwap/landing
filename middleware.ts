import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "./lib/dal/session";
import { SessionData } from "./lib/dal/types";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing protected route
    if (pathname.startsWith("/dashboard")) {
        // Get session from encrypted cookie
        const response = NextResponse.next();
        const session = await getIronSession<SessionData>(
            request,
            response,
            sessionOptions,
        );

        // If no valid session, redirect to login
        if (!session.isLoggedIn || !session.userId) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Check session age for additional security
        if (session.createdAt) {
            const maxAge = sessionOptions.cookieOptions?.maxAge ||
                60 * 60 * 24 * 7;
            const age = (Date.now() - session.createdAt) / 1000;

            if (age > maxAge) {
                // Session expired, destroy and redirect
                session.destroy();
                return NextResponse.redirect(new URL("/login", request.url));
            }

            // Session rotation: refresh session if older than half max age
            const halfAge = maxAge / 2;
            if (age > halfAge) {
                session.createdAt = Date.now();
                await session.save();
            }
        }

        return response;
    } else if (pathname === "/login") {
        // Redirect logged-in users away from login page
        const response = NextResponse.next();
        const session = await getIronSession<SessionData>(
            request,
            response,
            sessionOptions,
        );

        if (session.isLoggedIn && session.userId) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
