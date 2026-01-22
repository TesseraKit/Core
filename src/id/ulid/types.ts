/**
 * @module id/ulid/types
 * @description Type definitions and schema for ULID
 */

import { Brand } from "effect";
import { Schema as S } from "@effect/schema";
import { ULID_PATTERN } from "./constants.js";

/**
 * Branded type for ULID strings
 * Ensures type-level distinction from regular strings
 */
export type UlidType = string & Brand.Brand<"Ulid">;

/**
 * Effect Schema for ULID validation and parsing
 */
export const UlidSchema: S.Schema<UlidType, string> = S.String.pipe(
  S.pattern(ULID_PATTERN),
  S.brand("Ulid"),
);
