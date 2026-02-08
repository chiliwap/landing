import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const dynamodb = DynamoDBDocumentClient.from(client);

// Table names
export const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE!;
export const SESSIONS_TABLE = process.env.DYNAMODB_SESSIONS_TABLE!;
export const MAGIC_LINKS_TABLE = process.env.DYNAMODB_MAGIC_LINKS_TABLE!;
export const BILLING_TABLE = process.env.DYNAMODB_BILLING_TABLE!;
export const DASHBOARD_OVERVIEW_TABLE = process.env
    .DYNAMODB_DASHBOARD_OVERVIEW_TABLE!;
export const DASHBOARD_ACTIVITY_TABLE = process.env
    .DYNAMODB_DASHBOARD_ACTIVITY_TABLE!;
export const DASHBOARD_ALERTS_TABLE = process.env
    .DYNAMODB_DASHBOARD_ALERTS_TABLE!;
export const DASHBOARD_SCHEDULE_TABLE = process.env
    .DYNAMODB_DASHBOARD_SCHEDULE_TABLE!;
