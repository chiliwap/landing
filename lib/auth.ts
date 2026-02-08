/**
 * @deprecated This module is the legacy auth system using plain-text cookie sessions.
 * Use the DAL layer instead: import { createSession, destroySession, ... } from "@/lib/dal"
 * This file is kept only for backward compatibility and should NOT be imported in new code.
 */

import crypto from "crypto";
import { CardBrand } from "@/components/billing/card-brands";
import {
    BILLING_TABLE,
    dynamodb,
    MAGIC_LINKS_TABLE,
    SESSIONS_TABLE,
    USERS_TABLE,
} from "./dynamodb";
import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

// Argon2 for password hashing
import argon2 from "argon2";

// Basic phone sanitizer mirroring profile action logic (lightweight subset)
function sanitizePhone(input: string) {
    let cleaned = input.replace(/ext\.?/gi, "x");
    let ext = "";
    const extMatch = cleaned.match(/(?:x)\s*(\d{1,10})$/i);
    if (extMatch) {
        ext = extMatch[1];
        cleaned = cleaned.slice(0, extMatch.index).trim();
    }
    let digits = cleaned.replace(/[^0-9]/g, "");
    if (digits.length > 10 && digits[0] === "1") {
        digits = digits.slice(1); // drop leading country 1 for formatting, stored normalized
    }
    const core = digits.slice(0, 10);
    let formatted = core;
    if (core.length <= 3) {
        formatted = core.length ? `(${core}` : "";
    } else if (core.length <= 6) {
        formatted = `(${core.slice(0, 3)}) ${core.slice(3)}`;
    } else {
        formatted = `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${
            core.slice(6)
        }`;
    }
    let result = formatted.trim();
    if (ext) result += ` x${ext}`;
    return result || undefined;
}

export interface User {
    id: string;
    email: string;
    phone?: string;
    address?: string;
    name: string;
    picture?: string;
    createdAt: string;
    updatedAt: string;
}

// DB shape for a user record which may include internal fields like passwordHash
export interface DBUser extends User {
    passwordHash?: string;
    [key: string]: unknown;
}

export type Card = {
    id: string;
    createdAt: string;
    // Stripe payment method id (e.g. pm_xxx) if sourced from Stripe
    pmId?: string;
    details: {
        name: string;
        address: string;
        brand: CardBrand;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
};

export interface Billing {
    id: string;
    customerId: string; // stripe customer ID
    paymentId: string; // stripe payment ID
    methods: Card[]; // stored locally (each may optionally reference a Stripe pmId)
    defaultMethodId: string;
    plan?: string; // subscription or account plan tier
    updatedAt: string;
}

export interface AuthSession {
    user: User;
    token: string;
    expiresAt: number;
}

export interface DBSession {
    sessionId: string;
    userId: string;
    token: string;
    expiresAt: number;
    createdAt: string;
}

// List all active (non‑expired) sessions for a user. Falls back to empty list on error.
export async function listUserSessions(userId: string): Promise<DBSession[]> {
    if (!userId) return [];
    try {
        const result = await dynamodb.send(
            new ScanCommand({
                TableName: SESSIONS_TABLE,
                FilterExpression: "#uid = :uid",
                ExpressionAttributeNames: { "#uid": "userId" },
                ExpressionAttributeValues: { ":uid": userId },
            }),
        );
        const items = (result.Items || []) as DBSession[];
        const now = Math.floor(Date.now() / 1000);
        return items.filter((s) => s.expiresAt >= now).sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
        );
    } catch (e) {
        console.error("listUserSessions error", e);
        return [];
    }
}

// Revoke a session by token; returns boolean success
export async function revokeSession(token: string): Promise<boolean> {
    if (!token) return false;
    try {
        await dynamodb.send(
            new DeleteCommand({
                TableName: SESSIONS_TABLE,
                Key: { token },
            }),
        );
        return true;
    } catch (e) {
        console.error("revokeSession error", e);
        return false;
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await dynamodb.send(
            new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "#email = :email",
                ExpressionAttributeNames: { "#email": "email" },
                ExpressionAttributeValues: { ":email": email.toLowerCase() },
                Limit: 1,
            }),
        );

        if (!result.Items || result.Items.length === 0) return null;

        // console.log("Found user by email:", result.Items[0]);

        return result.Items[0] as User;
    } catch (error) {
        console.error("Error finding user by email:", error);
        return null;
    }
}

export async function createSession(user: User): Promise<AuthSession> {
    const sessionId = `session_${Date.now()}_${crypto.randomBytes(16).toString("hex")}`;
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours IN SECONDS
    const now = new Date().toISOString();

    const dbSession: DBSession = {
        sessionId,
        userId: user.id,
        token,
        expiresAt,
        createdAt: now,
    };

    await dynamodb.send(
        new PutCommand({
            TableName: SESSIONS_TABLE,
            Item: dbSession,
        }),
    );

    return {
        user,
        token,
        expiresAt,
    };
}

export async function validateSession(
    token: string,
): Promise<AuthSession | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: SESSIONS_TABLE,
                Key: { token },
            }),
        );

        if (!result.Item) return null;

        const session = result.Item as DBSession;

        // Check if session is expired
        if (session.expiresAt < Math.floor(Date.now() / 1000)) {
            // Clean up expired session
            await dynamodb.send(
                new DeleteCommand({
                    TableName: SESSIONS_TABLE,
                    Key: { token },
                }),
            );
            return null;
        }

        // Get user data
        const user = await findUserById(session.userId);
        if (!user) return null;

        return {
            user,
            token,
            expiresAt: session.expiresAt,
        };
    } catch (error) {
        console.error("Error validating session:", error);
        return null;
    }
}

export async function findUserById(userId: string): Promise<User | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
            }),
        );

        if (!result.Item) return null;

        return result.Item as User;
    } catch (error) {
        console.error("Error finding user by ID:", error);
        return null;
    }
}

export async function findUserBillingById(
    userId: string,
): Promise<Billing | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: BILLING_TABLE,
                Key: { id: userId },
            }),
        );

        if (!result.Item) return null;

        return result.Item as Billing;
    } catch (error) {
        console.error("Error finding user billing by ID:", error);
        return null;
    }
}

export async function createGoogleUser(
    email: string,
    name: string,
    picture?: string,
    extras?: { phone?: string; address?: string },
): Promise<User> {
    const userId = `user_${Date.now()}_${
        crypto.randomBytes(12).toString("hex")
    }`;
    const now = new Date().toISOString();

    const user: User = {
        id: userId,
        email: email.toLowerCase(),
        name,
        picture,
        phone: extras?.phone ? sanitizePhone(extras.phone) : undefined,
        address: extras?.address?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
    };

    await dynamodb.send(
        new PutCommand({
            TableName: USERS_TABLE,
            Item: user,
            ConditionExpression: "attribute_not_exists(email)",
        }),
    );

    return user;
}

export async function createEmailUser(
    email: string,
    name?: string,
    extras?: { phone?: string; address?: string },
): Promise<User> {
    const userId = `user_${Date.now()}_${
        crypto.randomBytes(12).toString("hex")
    }`;
    const now = new Date().toISOString();

    const user: User = {
        id: userId,
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        phone: extras?.phone ? sanitizePhone(extras.phone) : undefined,
        address: extras?.address?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
    };

    await dynamodb.send(
        new PutCommand({
            TableName: USERS_TABLE,
            Item: user,
            ConditionExpression: "attribute_not_exists(email)",
        }),
    );

    return user;
}

// Password helpers using Argon2
export async function hashPassword(password: string): Promise<string> {
    try {
        return await argon2.hash(password);
    } catch (e) {
        console.error("hashPassword error", e);
        throw e;
    }
}

export async function verifyPassword(
    hash: string,
    password: string,
): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
    } catch (e) {
        console.error("verifyPassword error", e);
        return false;
    }
}

// Create a new user with a password. Returns the created User (without passwordHash).
export async function createUserWithPassword(
    email: string,
    password: string,
    name?: string,
    extras?: { phone?: string; address?: string },
): Promise<User> {
    const userId = `user_${Date.now()}_${
        crypto.randomBytes(12).toString("hex")
    }`;
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);

    const user: User = {
        id: userId,
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        phone: extras?.phone ? sanitizePhone(extras.phone) : undefined,
        address: extras?.address?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
    };

    // Store user along with passwordHash in the users table
    await dynamodb.send(
        new PutCommand({
            TableName: USERS_TABLE,
            Item: { ...user, passwordHash },
            ConditionExpression: "attribute_not_exists(email)",
        }),
    );

    return user;
}

// Authenticate a user by email/password. Returns User on success, null on failure.
export async function authenticateUser(
    email: string,
    password: string,
): Promise<User | null> {
    try {
        const result = await dynamodb.send(
            new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "#email = :email",
                ExpressionAttributeNames: { "#email": "email" },
                ExpressionAttributeValues: { ":email": email.toLowerCase() },
                Limit: 1,
            }),
        );

        if (!result.Items || result.Items.length === 0) return null;
        const rec = result.Items[0] as DBUser;

        const now = Math.floor(Date.now() / 1000);
        // check lockout
        const lockout = rec.lockoutUntil as number | undefined;
        if (lockout && lockout > now) {
            // user is locked out
            return null;
        }

        const hash = rec.passwordHash as string | undefined;
        if (!hash) return null; // no password set

        const ok = await verifyPassword(hash, password);
        if (!ok) {
            // record failed login attempt
            try {
                await recordFailedLogin(rec.id);
            } catch (e) {
                console.error("recordFailedLogin error", e);
            }
            return null;
        }

        // on success, reset failed login counters
        try {
            await resetFailedLogin(rec.id);
        } catch (e) {
            console.error("resetFailedLogin error", e);
        }

        // Remove passwordHash before returning the user object
        delete rec.passwordHash;
        return rec as unknown as User;
    } catch (e) {
        console.error("authenticateUser error", e);
        return null;
    }
}

// Failed login / lockout helpers
const FAILED_LOGIN_THRESHOLD = 5;
const LOCKOUT_DURATION_SEC = 30 * 60; // 30 minutes

export async function recordFailedLogin(userId: string): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    try {
        const result = await dynamodb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
                UpdateExpression:
                    "SET #failed = if_not_exists(#failed, :zero) + :inc, #lastFailed = :now",
                ExpressionAttributeNames: {
                    "#failed": "failedLoginCount",
                    "#lastFailed": "lastFailedAt",
                },
                ExpressionAttributeValues: {
                    ":inc": 1,
                    ":zero": 0,
                    ":now": now,
                },
                ReturnValues: "UPDATED_NEW",
            }),
        );

        const newFailed =
            (result.Attributes &&
                (result.Attributes.failedLoginCount as number)) || 0;
        if (newFailed >= FAILED_LOGIN_THRESHOLD) {
            const lockUntil = now + LOCKOUT_DURATION_SEC;
            await dynamodb.send(
                new UpdateCommand({
                    TableName: USERS_TABLE,
                    Key: { id: userId },
                    UpdateExpression: "SET #lock = :lock",
                    ExpressionAttributeNames: { "#lock": "lockoutUntil" },
                    ExpressionAttributeValues: { ":lock": lockUntil },
                }),
            );
        }
    } catch (e) {
        console.error("recordFailedLogin db error", e);
    }
}

export async function resetFailedLogin(userId: string): Promise<void> {
    try {
        await dynamodb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
                UpdateExpression: "SET #failed = :zero REMOVE #lock, #last",
                ExpressionAttributeNames: {
                    "#failed": "failedLoginCount",
                    "#lock": "lockoutUntil",
                    "#last": "lastFailedAt",
                },
                ExpressionAttributeValues: { ":zero": 0 },
            }),
        );
    } catch (e) {
        console.error("resetFailedLogin db error", e);
    }
}

// Update or set a user's password by userId
export async function setPasswordForUser(
    userId: string,
    password: string,
): Promise<boolean> {
    try {
        const hash = await hashPassword(password);
        await dynamodb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
                UpdateExpression: "SET #ph = :hash, #updated = :updated",
                ExpressionAttributeNames: {
                    "#ph": "passwordHash",
                    "#updated": "updatedAt",
                },
                ExpressionAttributeValues: {
                    ":hash": hash,
                    ":updated": new Date().toISOString(),
                },
            }),
        );
        return true;
    } catch (e) {
        console.error("setPasswordForUser error", e);
        return false;
    }
}

export interface MagicLinkRecord {
    token: string;
    email: string;
    redirectPath?: string;
    expiresAt: number; // epoch sec
    used?: boolean;
    createdAt: string;
}

export async function storeMagicLink(record: MagicLinkRecord) {
    await dynamodb.send(
        new PutCommand({
            TableName: MAGIC_LINKS_TABLE,
            Item: record,
        }),
    );
}

export async function consumeMagicToken(
    token: string,
): Promise<MagicLinkRecord | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({ TableName: MAGIC_LINKS_TABLE, Key: { token } }),
        );
        if (!result.Item) return null;
        const rec = result.Item as MagicLinkRecord;
        if (rec.used) return null;
        if (rec.expiresAt < Math.floor(Date.now() / 1000)) return null;
        await dynamodb.send(
            new UpdateCommand({
                TableName: MAGIC_LINKS_TABLE,
                Key: { token },
                UpdateExpression: "SET #used = :true",
                ExpressionAttributeNames: { "#used": "used" },
                ExpressionAttributeValues: { ":true": true },
            }),
        );
        return rec;
    } catch (e) {
        console.error("consumeMagicToken error", e);
        return null;
    }
}

export function buildSessionCookie(session: AuthSession) {
    return {
        name: "auth_session",
        value: JSON.stringify(session),
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 24 * 60 * 60,
        },
    };
}

// cookie storage
import { cookies } from "next/headers";

export async function getSessionFromCookies(): Promise<AuthSession | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie) return null;

    try {
        const session = JSON.parse(sessionCookie.value);
        return session as AuthSession;
    } catch {
        return null;
    }
}

export async function logout(): Promise<void> {
    const session = await getSessionFromCookies();
    if (session) {
        // Remove session from database
        try {
            await dynamodb.send(
                new DeleteCommand({
                    TableName: SESSIONS_TABLE,
                    Key: { token: session.token },
                }),
            );
        } catch (error) {
            console.error("Error removing session from database:", error);
        }
    }
    // Clear session cookie
    await clearSessionCookie();
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
}

export async function getUser(): Promise<User | null> {
    const session = await getSessionFromCookies();
    if (!session) return null;

    const valid = await validateSession(session.token);
    if (!valid) return null;

    return valid.user;
}
