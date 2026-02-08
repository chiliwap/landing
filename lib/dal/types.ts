/**
 * Data Access Layer Types
 *
 * Shared TypeScript types for the DAL layer
 */

import { CardBrand } from "@/components/billing/card-brands";

export interface User {
    id: string;
    email: string;
    phone?: string;
    address?: string;
    name: string;
    picture?: string;
    emailVerified?: boolean;
    emailVerifiedAt?: string;
    expireAt?: number; // TTL for unverified accounts (Unix timestamp)
    createdAt: string;
    updatedAt: string;
}

/**
 * Database user record that may include sensitive fields
 * These fields should NEVER be exposed to the client
 */
export interface DBUser extends User {
    passwordHash?: string;
    failedLoginCount?: number;
    lastFailedAt?: number;
    lockoutUntil?: number;
    [key: string]: unknown;
}

export interface MagicLinkRecord {
    token: string;
    email: string;
    redirectPath?: string;
    expiresAt: number; // epoch seconds
    used?: boolean;
    createdAt: string;
}

export interface DBSession {
    sessionId: string;
    userId: string;
    token: string;
    expiresAt: number;
    createdAt: string;
}

/**
 * Session data stored in encrypted iron-session cookie
 */
export interface SessionData {
    userId: string;
    email: string;
    name: string;
    isLoggedIn: boolean;
    createdAt: number;
    oauthState?: string;
}

/**
 * Billing and Payment Types
 */
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
