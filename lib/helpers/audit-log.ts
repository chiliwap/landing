/**
 * Audit logging for security-relevant events.
 *
 * Currently logs to stdout in structured JSON format.
 * In production, these logs should be shipped to a log aggregator
 * (e.g. Datadog, CloudWatch, Axiom) for retention and alerting.
 */

export type AuditEvent =
    | "login_success"
    | "login_failed"
    | "login_locked_out"
    | "logout"
    | "password_reset_requested"
    | "password_reset_completed"
    | "account_created"
    | "email_verified"
    | "oauth_login"
    | "oauth_user_created";

interface AuditEntry {
    event: AuditEvent;
    email?: string;
    userId?: string;
    ip?: string;
    metadata?: Record<string, unknown>;
}

export function auditLog(entry: AuditEntry): void {
    const log = {
        timestamp: new Date().toISOString(),
        level: "audit",
        ...entry,
    };

    // Structured JSON log line for easy parsing by log aggregators
    console.log(JSON.stringify(log));
}
