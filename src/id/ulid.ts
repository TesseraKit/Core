/**
 * @module id/ulid
 * @description ULID (Universally Unique Lexicographically Sortable Identifier) generation
 *
 * ULIDs are 128-bit identifiers that are:
 * - Lexicographically sortable
 * - Case insensitive
 * - URL safe (using Crockford's Base32)
 * - 1.21e+24 unique ULIDs per millisecond
 *
 * Format: TTTTTTTTTTRRRRRRRRRRRRR (26 characters)
 * - T: Timestamp (10 chars, 48 bits, milliseconds since Unix epoch)
 * - R: Randomness (16 chars, 80 bits)
 *
 * @example
 * ```ts
 * import { Ulid } from "@tesserakit/core/id";
 * import { Effect } from "effect";
 *
 * // Generate a ULID
 * const ulid = Ulid.generate();
 * // => "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *
 * // With Effect for testability
 * const program = Ulid.generateEffect;
 * const result = Effect.runSync(program);
 * ```
 */

export * from "./ulid";
