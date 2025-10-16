import { type NextRequest, NextResponse } from "next/server";
import { createGoogleUser, createSession, findUserByEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
        return NextResponse.redirect(
            new URL(`/?error=${encodeURIComponent(error)}`, request.url),
        );
    }

    if (!code) {
        // Redirect to Google OAuth
        const googleAuthUrl = new URL(
            "https://accounts.google.com/o/oauth2/v2/auth",
        );
        googleAuthUrl.searchParams.set(
            "client_id",
            process.env.GOOGLE_CLIENT_ID!,
        );
        googleAuthUrl.searchParams.set(
            "redirect_uri",
            process.env.GOOGLE_REDIRECT_URI!,
        );
        googleAuthUrl.searchParams.set("response_type", "code");
        googleAuthUrl.searchParams.set("scope", "openid email profile");
        googleAuthUrl.searchParams.set("access_type", "offline");

        return NextResponse.redirect(googleAuthUrl.toString());
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                }),
            },
        );

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(
                tokens.error_description ||
                    "Failed to exchange code for tokens",
            );
        }

        // Get user info from Google
        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            },
        );

        const googleUser = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error("Failed to get user info from Google");
        }

        // Find or create user in DynamoDB
        let user = await findUserByEmail(googleUser.email);

        if (!user) {
            user = await createGoogleUser(
                googleUser.email,
                googleUser.name,
                googleUser.picture,
            );
        }

        // Create session
        const session = await createSession(user);

        // Redirect to dashboard with session data
        const redirectUrl = new URL("/dashboard", request.url);
        const response = NextResponse.redirect(redirectUrl);

        // Set session cookie
        response.cookies.set("auth_session", JSON.stringify(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60, // 24 hours
        });

        return response;
    } catch (error) {
        console.error("Google OAuth error:", error);
        return NextResponse.redirect(
            new URL(
                `/?error=${encodeURIComponent("Authentication failed")}`,
                request.url,
            ),
        );
    }
}
