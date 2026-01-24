/**
 * @module schema/crud/constants
 * @description Constants for CRUD schema generation
 */

/**
 * Auto-generated fields that should be excluded from create input
 */
export const AUTO_GENERATED_FIELDS = [
  "id",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "deletedAt",
  "deletedBy",
  "isDeleted",
] as const;

/**
 * Fields that should be excluded from update input
 */
export const UPDATE_EXCLUDED_FIELDS = ["id", "createdAt", "createdBy"] as const;
