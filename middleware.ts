import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser, logout } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing protected route
    if (pathname.startsWith("/dashboard")) {
        const sessionCookie = request.cookies.get("auth_session");
        const localSession = request.headers.get("authorization");

        // If no session found, redirect to login
        if (!sessionCookie && !localSession) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Validate session if exists
        if (sessionCookie) {
            try {
                const session = JSON.parse(sessionCookie.value);
                if (session.expiresAt < Math.floor(Date.now() / 1000)) {
                    // Session expired, clear cookie and redirect
                    const response = NextResponse.redirect(
                        new URL("/", request.url),
                    );
                    response.cookies.delete("auth_session");
                    return response;
                }
            } catch {
                // Invalid session, clear cookie and redirect
                const response = NextResponse.redirect(
                    new URL("/", request.url),
                );
                response.cookies.delete("auth_session");
                return response;
            }
        }

        // check if logged in -- if not, redirect to login (i.e. session could be invalid)
        const user = await getUser();
        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else if (pathname === "/logout") {
        // Redirect logout requests to home
        await logout();

        return NextResponse.redirect(new URL("/", request.url));
    } else if (pathname === "/login") {
        // Redirect logged-in users away from login page
        const user = await getUser();
        const isAuthenticated = !!user;

        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/logout", "/login"],
};
