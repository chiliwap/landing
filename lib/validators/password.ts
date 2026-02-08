/**
 * Password Validation Utility
 *
 * Enforces password strength requirements
 */

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_REQUIREMENTS = {
    minLength: PASSWORD_MIN_LENGTH,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
};

/**
 * Validate password against complexity requirements
 *
 * Requirements:
 * - Minimum 10 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password) {
        errors.push("Password is required");
        return { isValid: false, errors };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.push(
            `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        );
    }

    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    if (PASSWORD_REQUIREMENTS.requireSpecial && !/[!@#$%^&*]/.test(password)) {
        errors.push(
            "Password must contain at least one special character (!@#$%^&*)",
        );
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Get password requirements as a user-friendly string
 */
export function getPasswordRequirements(): string {
    return `Password must contain:
• At least ${PASSWORD_MIN_LENGTH} characters
• One uppercase letter (A-Z)
• One lowercase letter (a-z)
• One number (0-9)
• One special character (!@#$%^&*)`;
}
