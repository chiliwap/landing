/**
 * Password Reset Token Data Access Layer
 *
 * Handles secure token generation and validation for password reset flows.
 * Note: These are NOT for passwordless authentication - only for password resets.
 */

import crypto from "crypto";
import { dynamodb, MAGIC_LINKS_TABLE } from "../dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { MagicLinkRecord } from "./types";

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Store a password reset token in the database
 */
export async function createMagicLink(
    email: string,
    redirectPath?: string,
    expiryMinutes: number = 15,
): Promise<MagicLinkRecord> {
    const token = generateToken();
    const expiresAt = Math.floor(Date.now() / 1000) + expiryMinutes * 60;

    const record: MagicLinkRecord = {
        token,
        email: email.toLowerCase(),
        redirectPath,
        expiresAt,
        used: false,
        createdAt: new Date().toISOString(),
    };

    await dynamodb.send(
        new PutCommand({
            TableName: MAGIC_LINKS_TABLE,
            Item: record,
        }),
    );

    return record;
}

/**
 * Validate and consume a password reset token
 * Returns the token record if valid, null otherwise
 * Marks the token as used to prevent replay attacks
 */
export async function consumeMagicLink(
    token: string,
): Promise<MagicLinkRecord | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: MAGIC_LINKS_TABLE,
                Key: { token },
            }),
        );

        if (!result.Item) return null;

        const record = result.Item as MagicLinkRecord;

        // Check if already used
        if (record.used) return null;

        // Check if expired
        if (record.expiresAt < Math.floor(Date.now() / 1000)) return null;

        // Mark as used
        await dynamodb.send(
            new UpdateCommand({
                TableName: MAGIC_LINKS_TABLE,
                Key: { token },
                UpdateExpression: "SET #used = :true",
                ExpressionAttributeNames: { "#used": "used" },
                ExpressionAttributeValues: { ":true": true },
            }),
        );

        return record;
    } catch (e) {
        console.error("consumeMagicLink error", e);
        return null;
    }
}
