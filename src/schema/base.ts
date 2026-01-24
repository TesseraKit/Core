/**
 * @module schema/base
 * @description Base entity schemas and mixins for Forge entities
 *
 * Provides composable schema building blocks:
 * - Timestamps (createdAt, updatedAt)
 * - Audit fields (createdBy, updatedBy)
 * - Soft delete support
 * - Base entity with all common fields
 *
 * @example
 * ```ts
 * import { BaseEntity, createEntitySchema } from "@tesserakit/core/schema";
 * import { Schema as S } from "@effect/schema";
 *
 * // Create a custom entity schema
 * const PersonSchema = createEntitySchema("Person", {
 *   firstName: S.String,
 *   lastName: S.String,
 *   birthDate: S.optional(S.Date),
 * });
 * ```
 */

export * from "./base";
