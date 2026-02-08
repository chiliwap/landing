/**
 * Data Access Layer - Main Export
 *
 * Central export point for all DAL modules following the recommended
 * Next.js pattern for data access layer organization.
 *
 * Usage:
 *   import { getUserById, createSession } from "@/lib/dal";
 */

import { getBillingById } from "./billing";
import { verifySession } from "./session";
import { getUserById } from "./users";

// Session management
export {
    createSession,
    destroySession,
    getCurrentUserId,
    getSession,
    isAuthenticated,
    sessionOptions,
    verifySession,
} from "./session";

// User operations
export {
    authenticateUser,
    createOAuthUser,
    createUser,
    getUserByEmail,
    getUserById,
    updateUserPassword,
    updateUserProfile,
} from "./users";

// Password reset tokens (internal use for email-based password reset)
export { consumeMagicLink, createMagicLink } from "./magic-links";

// Email verification
export {
    createEmailVerificationToken,
    verifyEmailToken,
} from "./email-verification";
export { getBillingById } from "./billing";

// Types
export type {
    Billing,
    Card,
    DBUser,
    MagicLinkRecord,
    SessionData,
    User,
} from "./types";

// Helper function for backward compatibility
// Gets current user from session
export async function getUser() {
    const session = await verifySession();
    if (!session) return null;

    const user = await getUserById(session.userId);
    return user;
}

// Backward compatibility aliases
export const findUserBillingById = getBillingById;

/**
 * Note: Session management functions below are deprecated.
 * With iron-session, sessions are stored in encrypted cookies, not in the database.
 * These functions are provided for backward compatibility but should be migrated away from.
 */

import { DBSession } from "./types";

/**
 * @deprecated Sessions are now managed via iron-session (encrypted cookies).
 * This function returns an empty array as sessions are no longer stored in the database.
 */
export async function listUserSessions(userId: string): Promise<DBSession[]> {
    console.warn(
        "listUserSessions is deprecated. Sessions are now managed via iron-session and not stored in the database.",
    );
    return [];
}

/**
 * @deprecated Sessions are now managed via iron-session (encrypted cookies).
 * Use destroySession() instead to clear the current session.
 */
export async function revokeSession(token: string): Promise<boolean> {
    console.warn(
        "revokeSession is deprecated. Use destroySession() to clear the current session.",
    );
    return true;
}
