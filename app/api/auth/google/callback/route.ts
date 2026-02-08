import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createOAuthUser, createSession, getSession, getUserByEmail } from "@/lib/dal";
import { auditLog } from "@/lib/helpers/audit-log";

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
        // Initiate OAuth flow: generate state, store in session, redirect to Google
        const state = crypto.randomBytes(32).toString("hex");
        const session = await getSession();
        session.oauthState = state;
        await session.save();

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
        googleAuthUrl.searchParams.set("state", state);

        return NextResponse.redirect(googleAuthUrl.toString());
    }

    try {
        // Validate state parameter to prevent CSRF
        const returnedState = searchParams.get("state");
        const session = await getSession();
        const storedState = session.oauthState;

        if (!returnedState || !storedState || returnedState !== storedState) {
            return NextResponse.redirect(
                new URL(
                    `/?error=${encodeURIComponent("Invalid OAuth state. Please try again.")}`,
                    request.url,
                ),
            );
        }

        // Clear the state from session after validation
        session.oauthState = undefined;
        await session.save();

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

        // Reject unverified Google emails
        if (googleUser.verified_email === false) {
            return NextResponse.redirect(
                new URL(
                    `/?error=${encodeURIComponent("Your Google email is not verified. Please verify it first.")}`,
                    request.url,
                ),
            );
        }

        // Find or create user in DynamoDB
        let user = await getUserByEmail(googleUser.email);

        if (!user) {
            user = await createOAuthUser(
                googleUser.email,
                googleUser.name,
                googleUser.picture,
            );
            auditLog({ event: "oauth_user_created", email: user.email, userId: user.id });
        }

        // Create iron-session
        await createSession(user.id, user.email, user.name);
        auditLog({ event: "oauth_login", email: user.email, userId: user.id });

        // Redirect to dashboard
        const redirectUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(redirectUrl);
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
