/**
 * Email Verification Token Data Access Layer
 *
 * Handles email verification tokens for new account verification
 */

import crypto from "crypto";
import { dynamodb, MAGIC_LINKS_TABLE } from "../dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export interface EmailVerificationToken {
    token: string;
    email: string;
    userId: string;
    expiresAt: number;
    used?: boolean;
    createdAt: string;
}

/**
 * Create an email verification token
 */
export async function createEmailVerificationToken(
    email: string,
    userId: string,
    expiryMinutes: number = 24 * 60, // 24 hours default
): Promise<EmailVerificationToken> {
    const token = `verify_${crypto.randomBytes(32).toString("hex")}`;
    const expiresAt = Math.floor(Date.now() / 1000) + expiryMinutes * 60;

    const record: EmailVerificationToken = {
        token,
        email: email.toLowerCase(),
        userId,
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
 * Validate and consume an email verification token
 * Returns token record if valid, null otherwise
 */
export async function verifyEmailToken(
    token: string,
): Promise<EmailVerificationToken | null> {
    try {
        const result = await dynamodb.send(
            new GetCommand({
                TableName: MAGIC_LINKS_TABLE,
                Key: { token },
            }),
        );

        if (!result.Item) return null;

        const record = result.Item as EmailVerificationToken;

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
        console.error("verifyEmailToken error", e);
        return null;
    }
}
