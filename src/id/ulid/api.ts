/**
 * @module id/ulid/api
 * @description Public API for ULID generation and manipulation
 */

import { Effect } from "effect";
import { ParseResult, Schema as S } from "@effect/schema";
import {
  ENCODING,
  TIME_LENGTH,
  RANDOM_LENGTH,
  ULID_LENGTH,
  ULID_PATTERN,
} from "./constants";
import { type UlidType, UlidSchema } from "./types";
import { encodeTime, encodeRandom, decodeTime } from "./encoding";

/**
 * ULID generation and manipulation utilities
 */
export const Ulid = {
  /**
   * The length of a ULID string (26 characters)
   */
  length: ULID_LENGTH,

  /**
   * Regular expression for validating ULID strings
   */
  pattern: ULID_PATTERN,

  /**
   * Effect Schema for ULID validation
   */
  schema: UlidSchema,

  /**
   * Generates a new ULID string
   *
   * @param timestamp - Optional timestamp in milliseconds (defaults to Date.now())
   * @returns A new ULID string
   *
   * @example
   * ```ts
   * const ulid = Ulid.generate();
   * // => "01ARZ3NDEKTSV4RRFFQ69G5FAV"
   *
   * // With specific timestamp
   * const ulid2 = Ulid.generate(1469918176385);
   * ```
   */
  generate: (timestamp?: number): UlidType => {
    const time = timestamp ?? Date.now();
    return (encodeTime(time, TIME_LENGTH) +
      encodeRandom(RANDOM_LENGTH)) as UlidType;
  },

  /**
   * Generates a new ULID as an Effect
   * Useful for dependency injection and testing
   *
   * @param timestamp - Optional timestamp in milliseconds
   * @returns Effect that produces a ULID
   *
   * @example
   * ```ts
   * import { Effect } from "effect";
   *
   * const program = Effect.gen(function* () {
   *   const id1 = yield* Ulid.generateEffect();
   *   const id2 = yield* Ulid.generateEffect();
   *   return [id1, id2];
   * });
   * ```
   */
  generateEffect: (timestamp?: number): Effect.Effect<UlidType> =>
    Effect.sync(() => Ulid.generate(timestamp)),

  /**
   * Validates whether a string is a valid ULID
   *
   * @param value - String to validate
   * @returns true if valid ULID, false otherwise
   *
   * @example
   * ```ts
   * Ulid.isValid("01ARZ3NDEKTSV4RRFFQ69G5FAV"); // true
   * Ulid.isValid("invalid"); // false
   * ```
   */
  isValid: (value: string): value is UlidType => {
    return typeof value === "string" && ULID_PATTERN.test(value);
  },

  /**
   * Parses a string into a ULID, throwing if invalid
   *
   * @param value - String to parse
   * @returns Parsed ULID
   * @throws Error if the string is not a valid ULID
   *
   * @example
   * ```ts
   * const ulid = Ulid.parse("01ARZ3NDEKTSV4RRFFQ69G5FAV");
   * ```
   */
  parse: (value: string): UlidType => {
    if (!Ulid.isValid(value)) {
      throw new Error(`Invalid ULID: ${value}`);
    }
    return value;
  },

  /**
   * Safely parses a string into a ULID using Effect
   *
   * @param value - String to parse
   * @returns Effect that succeeds with ULID or fails with error
   *
   * @example
   * ```ts
   * const result = Ulid.parseEffect("01ARZ3NDEKTSV4RRFFQ69G5FAV");
   * // Effect.succeed(ulid)
   *
   * const invalid = Ulid.parseEffect("invalid");
   * // Effect.fail(ParseError)
   * ```
   */
  parseEffect: (
    value: string,
  ): Effect.Effect<UlidType, ParseResult.ParseError> =>
    S.decode(UlidSchema)(value),

  /**
   * Extracts the timestamp from a ULID
   *
   * @param ulid - ULID to extract timestamp from
   * @returns Unix timestamp in milliseconds
   *
   * @example
   * ```ts
   * const ulid = Ulid.generate();
   * const timestamp = Ulid.timestamp(ulid);
   * const date = new Date(timestamp);
   * ```
   */
  timestamp: (ulid: UlidType): number => {
    return decodeTime(ulid);
  },

  /**
   * Extracts the timestamp from a ULID as a Date object
   *
   * @param ulid - ULID to extract date from
   * @returns Date object
   *
   * @example
   * ```ts
   * const ulid = Ulid.generate();
   * const date = Ulid.date(ulid);
   * console.log(date.toISOString());
   * ```
   */
  date: (ulid: UlidType): Date => {
    return new Date(decodeTime(ulid));
  },

  /**
   * Compares two ULIDs lexicographically
   *
   * @param a - First ULID
   * @param b - Second ULID
   * @returns -1 if a < b, 0 if a === b, 1 if a > b
   *
   * @example
   * ```ts
   * const ulids = [ulid3, ulid1, ulid2];
   * ulids.sort(Ulid.compare);
   * ```
   */
  compare: (a: UlidType, b: UlidType): -1 | 0 | 1 => {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  },

  /**
   * Generates a ULID for a specific point in time
   * Useful for creating time-based bounds for queries
   *
   * @param date - Date to generate ULID for
   * @returns ULID with timestamp from the given date
   *
   * @example
   * ```ts
   * // Get all records from today
   * const startOfDay = new Date();
   * startOfDay.setHours(0, 0, 0, 0);
   *
   * const minUlid = Ulid.fromDate(startOfDay);
   * // Query: WHERE id >= minUlid
   * ```
   */
  fromDate: (date: Date): UlidType => {
    return Ulid.generate(date.getTime());
  },

  /**
   * Creates a monotonic ULID generator
   * Guarantees strictly increasing ULIDs even within the same millisecond
   *
   * @returns A function that generates monotonically increasing ULIDs
   *
   * @example
   * ```ts
   * const generator = Ulid.monotonic();
   *
   * const id1 = generator();
   * const id2 = generator();
   * const id3 = generator();
   *
   * // id1 < id2 < id3 is guaranteed
   * ```
   */
  monotonic: (): (() => UlidType) => {
    let lastTime = 0;
    let lastRandom = "";

    return (): UlidType => {
      const now = Date.now();

      if (now === lastTime) {
        // Same millisecond - increment random portion
        const chars = lastRandom.split("");

        // Increment from right to left
        for (let i = chars.length - 1; i >= 0; i--) {
          const index = ENCODING.indexOf(chars[i]!);
          if (index < 31) {
            chars[i] = ENCODING[index + 1]!;
            break;
          }
          chars[i] = ENCODING[0]!;
          // Continue to next character (carry)
        }

        lastRandom = chars.join("");
      } else {
        lastTime = now;
        lastRandom = encodeRandom(RANDOM_LENGTH);
      }

      return (encodeTime(now, TIME_LENGTH) + lastRandom) as UlidType;
    };
  },
} as const;
