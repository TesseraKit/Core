/**
 * @module id/ulid/constants
 * @description Constants used for ULID generation and validation
 */

/**
 * Crockford's Base32 encoding alphabet
 * Excludes I, L, O, U to avoid confusion with 1, 1, 0, V
 */
export const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" as const;

/**
 * Length of ULID timestamp component (10 characters)
 */
export const TIME_LENGTH = 10;

/**
 * Length of ULID random component (16 characters)
 */
export const RANDOM_LENGTH = 16;

/**
 * Total length of a ULID (26 characters)
 */
export const ULID_LENGTH = TIME_LENGTH + RANDOM_LENGTH;

/**
 * Maximum timestamp value (2^48 - 1)
 * This is the year 10889 AD
 */
export const TIME_MAX = Math.pow(2, 48) - 1;

/**
 * Regular expression pattern for validating ULIDs
 * Uses Crockford's Base32 alphabet (case insensitive)
 */
export const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
