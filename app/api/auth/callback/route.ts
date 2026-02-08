import { type NextRequest, NextResponse } from "next/server";
import { createOAuthUser, createSession, getUserByEmail } from "@/lib/dal";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	if (error) {
		return NextResponse.redirect(
			new URL(`/?error=${encodeURIComponent(error)}`, request.url),
		);
	}

	if (!code) {
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
				tokens.error_description || "Token exchange failed",
			);
		}

		const userResponse = await fetch(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{ headers: { Authorization: `Bearer ${tokens.access_token}` } },
		);
		const googleUser = await userResponse.json();
		if (!userResponse.ok) {
			throw new Error("Failed to get user info");
		}

		let user = await getUserByEmail(googleUser.email);
		if (!user) {
			user = await createOAuthUser(
				googleUser.email,
				googleUser.name,
				googleUser.picture,
			);
		}

		// Create iron-session
		await createSession(user.id, user.email, user.name);

		const response = NextResponse.redirect(
			new URL("/dashboard", request.url),
		);
		return response;
	} catch (e) {
		console.error("Google OAuth error:", e);
		return NextResponse.redirect(
			new URL(
				`/?error=${encodeURIComponent("Authentication failed")}`,
				request.url,
			),
		);
	}
}
