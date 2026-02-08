/**
 * Billing Data Access Layer
 *
 * Handles billing and payment method operations
 */

import { BILLING_TABLE, dynamodb } from "../dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { Billing } from "./types";

/**
 * Get billing information for a user
 */
export async function getBillingById(userId: string): Promise<Billing | null> {
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
        console.error("getBillingById error", error);
        return null;
    }
}
