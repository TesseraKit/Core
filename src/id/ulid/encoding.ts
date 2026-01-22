/**
 * @module id/ulid/encoding
 * @description Internal utilities for encoding and decoding ULIDs
 */

import { ENCODING, TIME_LENGTH, TIME_MAX } from "./constants";

/**
 * Generates cryptographically secure random bytes
 * Works in both Node.js and browser environments
 */
export const getRandomValues = (length: number): Uint8Array => {
  const buffer = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    // Fallback for older Node.js versions
    for (let i = 0; i < length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }

  return buffer;
};

/**
 * Encodes a timestamp into Crockford's Base32
 */
export const encodeTime = (timestamp: number, length: number): string => {
  if (timestamp < 0 || timestamp > TIME_MAX) {
    throw new RangeError(
      `Timestamp must be between 0 and ${TIME_MAX}, got ${timestamp}`,
    );
  }

  let str = "";
  let remaining = timestamp;

  for (let i = length; i > 0; i--) {
    const mod = remaining % 32;
    str = ENCODING[mod] + str;
    remaining = Math.floor(remaining / 32);
  }

  return str;
};

/**
 * Encodes random bytes into Crockford's Base32
 */
export const encodeRandom = (length: number): string => {
  const bytes = getRandomValues(length);
  let str = "";

  for (let i = 0; i < length; i++) {
    str += ENCODING[bytes[i]! % 32];
  }

  return str;
};

/**
 * Decodes a Crockford's Base32 character to its numeric value
 */
export const decodeChar = (char: string): number => {
  const upper = char.toUpperCase();

  // Handle commonly confused characters
  if (upper === "I" || upper === "L") return 1;
  if (upper === "O") return 0;
  if (upper === "U") return 27; // Maps to V

  const index = ENCODING.indexOf(upper);
  if (index === -1) {
    throw new Error(`Invalid ULID character: ${char}`);
  }

  return index;
};

/**
 * Extracts the timestamp from a ULID string
 */
export const decodeTime = (ulid: string): number => {
  const timeChars = ulid.slice(0, TIME_LENGTH);
  let timestamp = 0;

  for (let i = 0; i < TIME_LENGTH; i++) {
    timestamp = timestamp * 32 + decodeChar(timeChars[i]!);
  }

  return timestamp;
};
