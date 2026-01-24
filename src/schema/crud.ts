/**
 * @module schema/crud
 * @description CRUD operation schema generators
 *
 * Provides factory functions for generating type-safe CRUD operation schemas
 * from entity definitions.
 *
 * @example
 * ```ts
 * import { createCrudSchemas } from "@tesserakit/core/schema";
 *
 * const PersonCrud = createCrudSchemas(PersonSchema, "Person");
 *
 * // Use generated schemas
 * const createInput: PersonCrud.CreateInput = { firstName: "John", lastName: "Doe" };
 * ```
 */

export * from "./crud";
