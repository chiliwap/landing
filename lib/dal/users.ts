/**
 * User Data Access Layer
 *
 * This module provides secure database operations for user management.
 * All database queries are isolated here, following the DAL pattern.
 *
 * Security features:
 * - Password hashing with Argon2
 * - Account lockout after failed attempts
 * - Sanitized phone numbers
 * - No password hashes exposed to application layer
 */

import crypto from "crypto";
import { dynamodb, USERS_TABLE } from "../dynamodb";
import {
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import argon2 from "argon2";
import { DBUser, User } from "./types";

/**
 * Security constants
 */
const FAILED_LOGIN_THRESHOLD = 5;
const LOCKOUT_DURATION_SEC = 30 * 60; // 30 minutes

/**
 * Sanitize phone number to consistent format
 */
function sanitizePhone(input: string): string | undefined {
    let cleaned = input.replace(/ext\.?/gi, "x");
    let ext = "";
    const extMatch = cleaned.match(/(?:x)\s*(\d{1,10})$/i);
    if (extMatch) {
        ext = extMatch[1];
        cleaned = cleaned.slice(0, extMatch.index).trim();
    }
    let digits = cleaned.replace(/[^0-9]/g, "");
    if (digits.length > 10 && digits[0] === "1") {
        digits = digits.slice(1);
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

/**
 * Remove sensitive fields from DBUser before returning to application layer
 */
function sanitizeUser(dbUser: DBUser): User {
    const {
        passwordHash,
        failedLoginCount,
        lastFailedAt,
        lockoutUntil,
        ...user
    } = dbUser;
    return user as User;
}

/**
 * Hash password using Argon2
 */
async function hashPassword(password: string): Promise<string> {
    try {
        return await argon2.hash(password);
    } catch (e) {
        console.error("hashPassword error", e);
        throw e;
    }
}

/**
 * Verify password against hash using Argon2
 */
async function verifyPassword(
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

/**
 * QUERY FUNCTIONS
 */

/**
 * Find user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
            }),
        );

        if (!result.Item) return null;
        return sanitizeUser(result.Item as DBUser);
    } catch (error) {
        console.error("getUserById error", error);
        return null;
    }
}

/**
 * Find user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await dynamodb.send(
            new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "#email = :email",
                ExpressionAttributeNames: { "#email": "email" },
                ExpressionAttributeValues: { ":email": email.toLowerCase() },
            }),
        );

        if (!result.Items || result.Items.length === 0) return null;
        return sanitizeUser(result.Items[0] as DBUser);
    } catch (error) {
        console.error("getUserByEmail error", error);
        return null;
    }
}

/**
 * MUTATION FUNCTIONS
 */

/**
 * Create a new user with email/password
 */
export async function createUser(
    email: string,
    password: string,
    name?: string,
    extras?: { phone?: string; address?: string; expireAt?: number },
): Promise<User> {
    const userId = `user_${Date.now()}_${
        crypto.randomBytes(12).toString("hex")
    }`;
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);

    const user: DBUser = {
        id: userId,
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        phone: extras?.phone ? sanitizePhone(extras.phone) : undefined,
        address: extras?.address?.trim() || undefined,
        expireAt: extras?.expireAt, // TTL for unverified accounts
        passwordHash,
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

    return sanitizeUser(user);
}

/**
 * Create a user from OAuth (Google, etc.)
 */
export async function createOAuthUser(
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

    try {
        await dynamodb.send(
            new PutCommand({
                TableName: USERS_TABLE,
                Item: user,
                ConditionExpression: "attribute_not_exists(email)",
            }),
        );
        return user;
    } catch (e: any) {
        // Race condition: another request created the user first
        if (e.name === "ConditionalCheckFailedException") {
            const existing = await getUserByEmail(email);
            if (existing) return existing;
        }
        throw e;
    }
}

/**
 * Authenticate user with email/password
 * Returns user on success, null on failure
 * Implements account lockout after failed attempts
 */
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
            }),
        );

        if (!result.Items || result.Items.length === 0) return null;
        const dbUser = result.Items[0] as DBUser;

        // Check if account is locked out
        const now = Math.floor(Date.now() / 1000);
        const lockout = dbUser.lockoutUntil;
        if (lockout && lockout > now) {
            return null;
        }

        // Verify password
        const hash = dbUser.passwordHash;
        if (!hash) return null; // No password set

        const isValid = await verifyPassword(hash, password);

        if (!isValid) {
            // Record failed login attempt
            await recordFailedLogin(dbUser.id);
            return null;
        }

        // Success - reset failed login counter
        await resetFailedLogin(dbUser.id);
        return sanitizeUser(dbUser);
    } catch (e) {
        console.error("authenticateUser error", e);
        return null;
    }
}

/**
 * Update user password
 */
export async function updateUserPassword(
    userId: string,
    newPassword: string,
): Promise<boolean> {
    try {
        const hash = await hashPassword(newPassword);
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
        console.error("updateUserPassword error", e);
        return false;
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, "name" | "phone" | "address" | "picture">>,
): Promise<boolean> {
    try {
        const updateExpressions: string[] = [];
        const attributeNames: Record<string, string> = {};
        const attributeValues: Record<string, any> = {};

        if (updates.name !== undefined) {
            updateExpressions.push("#name = :name");
            attributeNames["#name"] = "name";
            attributeValues[":name"] = updates.name;
        }

        if (updates.phone !== undefined) {
            updateExpressions.push("#phone = :phone");
            attributeNames["#phone"] = "phone";
            attributeValues[":phone"] = sanitizePhone(updates.phone);
        }

        if (updates.address !== undefined) {
            updateExpressions.push("#address = :address");
            attributeNames["#address"] = "address";
            attributeValues[":address"] = updates.address.trim();
        }

        if (updates.picture !== undefined) {
            updateExpressions.push("#picture = :picture");
            attributeNames["#picture"] = "picture";
            attributeValues[":picture"] = updates.picture;
        }

        if (updateExpressions.length === 0) return false;

        updateExpressions.push("#updated = :updated");
        attributeNames["#updated"] = "updatedAt";
        attributeValues[":updated"] = new Date().toISOString();

        await dynamodb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id: userId },
                UpdateExpression: `SET ${updateExpressions.join(", ")}`,
                ExpressionAttributeNames: attributeNames,
                ExpressionAttributeValues: attributeValues,
            }),
        );

        return true;
    } catch (e) {
        console.error("updateUserProfile error", e);
        return false;
    }
}

/**
 * INTERNAL HELPER FUNCTIONS
 */

/**
 * Record a failed login attempt and implement lockout if threshold reached
 */
async function recordFailedLogin(userId: string): Promise<void> {
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

        const newFailed = result.Attributes?.failedLoginCount as number || 0;
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
        console.error("recordFailedLogin error", e);
    }
}

/**
 * Reset failed login counter after successful authentication
 */
async function resetFailedLogin(userId: string): Promise<void> {
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
        console.error("resetFailedLogin error", e);
    }
}
