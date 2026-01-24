/**
 * @module id/urn/constants
 * @description Constants used for URN validation and pattern matching
 */

import { ULID_PATTERN } from "../ulid/constants";

/**
 * Pattern for valid app names
 * - Lowercase letters and numbers only
 * - 1-32 characters
 */
export const APP_PATTERN = /^[a-z][a-z0-9]{0,31}$/;

/**
 * Pattern for valid entity names
 * - Lowercase letters, numbers, and hyphens
 * - Must start with a letter
 * - 1-64 characters
 */
export const ENTITY_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;

/**
 * Complete URN pattern
 * Format: {app}:{entity}:{ulid}
 */
export const URN_PATTERN = new RegExp(
  `^[a-z][a-z0-9]{0,31}:[a-z][a-z0-9-]{0,63}:${ULID_PATTERN.source.slice(1, -1)}$`,
  "i",
);
