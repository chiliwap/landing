/**
 * Session Management Layer using iron-session
 *
 * This module provides secure, encrypted cookie-based session management
 * following Next.js best practices with iron-session.
 *
 * Security features:
 * - Encrypted session cookies
 * - HttpOnly, Secure, SameSite protections
 * - Type-safe session data
 */

import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "./types";

// Require a strong session secret at startup to avoid runtime iron-session errors
const sessionPassword = process.env.SESSION_SECRET;
if (!sessionPassword || sessionPassword.length < 32) {
    throw new Error(
        "SESSION_SECRET is required and must be at least 32 characters. Set it in .env.local",
    );
}

/**
 * Session configuration
 * PASSWORD should be at least 32 characters long and stored in environment variables
 */
export const sessionOptions: SessionOptions = {
    password: sessionPassword,
    cookieName: "chiliwap_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    },
};

/**
 * Get the current session
 * Returns a session object with SessionData interface
 */
export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * Create a new authenticated session
 */
export async function createSession(
    userId: string,
    email: string,
    name: string,
) {
    const session = await getSession();

    session.userId = userId;
    session.email = email;
    session.name = name;
    session.isLoggedIn = true;
    session.createdAt = Date.now();

    await session.save();
}

/**
 * Destroy the current session
 */
export async function destroySession() {
    const session = await getSession();
    session.destroy();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session.isLoggedIn && !!session.userId;
}

/**
 * Get current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
    const session = await getSession();
    return session.isLoggedIn ? session.userId : null;
}

/**
 * Verify session is valid and not expired
 * Returns session data if valid, null otherwise
 */
export async function verifySession(): Promise<SessionData | null> {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
        return null;
    }

    // Optional: Add additional expiration checks
    // For example, check if createdAt is older than maxAge
    if (session.createdAt) {
        const maxAge = sessionOptions.cookieOptions?.maxAge || 60 * 60 * 24 * 7;
        const age = (Date.now() - session.createdAt) / 1000; // Convert to seconds

        if (age > maxAge) {
            await destroySession();
            return null;
        }
    }

    return {
        userId: session.userId,
        email: session.email,
        name: session.name,
        isLoggedIn: session.isLoggedIn,
        createdAt: session.createdAt,
    };
}
