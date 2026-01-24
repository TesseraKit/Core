/**
 * @module schema/crud/factory
 * @description Factory function for generating CRUD schemas
 */

import { Schema as S } from "@effect/schema";
import { UrnSchema } from "../../id/urn";
import { PaginationParams, PaginatedResponse } from "../pagination";
import { AUTO_GENERATED_FIELDS, UPDATE_EXCLUDED_FIELDS } from "./constants";
import { QueryFilters, type CrudSchemas } from "./types";

/**
 * Creates CRUD operation schemas for an entity
 *
 * @param entitySchema - The entity schema to generate CRUD operations for
 * @param entityName - Name of the entity (used for identifiers)
 * @returns Complete set of CRUD operation schemas
 *
 * @example
 * ```ts
 * const PersonCrud = createCrudSchemas(PersonSchema, "Person");
 *
 * // Use the generated schemas
 * const createInput: PersonCrud.CreateInput = {
 *   firstName: "John",
 *   lastName: "Doe"
 * };
 * ```
 */
export const createCrudSchemas = <T extends S.Schema.Any>(
  entitySchema: T,
  entityName: string,
): CrudSchemas<T> => {
  // Create input schema (omits auto-generated fields)
  const CreateInput = S.Struct(
    Object.fromEntries(
      Object.entries((entitySchema as any).fields || {}).filter(
        ([key]) => !AUTO_GENERATED_FIELDS.includes(key as any),
      ),
    ) as any,
  ).annotations({
    identifier: `${entityName}CreateInput`,
    title: `${entityName} Create Input`,
    description: `Input schema for creating a ${entityName}`,
  }) as any;

  // Update input schema (id + partial data)
  const UpdateInput = S.Struct({
    id: UrnSchema,
    data: S.partial(
      S.Struct(
        Object.fromEntries(
          Object.entries((entitySchema as any).fields || {}).filter(
            ([key]) => !UPDATE_EXCLUDED_FIELDS.includes(key as any),
          ),
        ) as any,
      ),
    ),
  }).annotations({
    identifier: `${entityName}UpdateInput`,
    title: `${entityName} Update Input`,
    description: `Input schema for updating a ${entityName}`,
  }) as any;

  // Find by ID input schema
  const FindByIdInput = S.Struct({
    id: UrnSchema,
  }).annotations({
    identifier: `${entityName}FindByIdInput`,
    title: `${entityName} Find By ID Input`,
    description: `Input schema for finding a ${entityName} by ID`,
  }) as any;

  // Find many input schema (with filters and pagination)
  const FindManyInput = S.Struct({
    filters: S.optional(QueryFilters),
    pagination: S.optional(PaginationParams),
  }).annotations({
    identifier: `${entityName}FindManyInput`,
    title: `${entityName} Find Many Input`,
    description: `Input schema for querying multiple ${entityName}s`,
  }) as any;

  // Delete input schema
  const DeleteInput = S.Struct({
    id: UrnSchema,
  }).annotations({
    identifier: `${entityName}DeleteInput`,
    title: `${entityName} Delete Input`,
    description: `Input schema for deleting a ${entityName}`,
  }) as any;

  // Paginated response schema
  const PaginatedResponseSchema = PaginatedResponse(
    entitySchema,
    `Paginated${entityName}s`,
  );

  return {
    Entity: entitySchema,
    CreateInput,
    UpdateInput,
    FindByIdInput,
    FindManyInput,
    DeleteInput,
    PaginatedResponse: PaginatedResponseSchema,
  } as CrudSchemas<T>;
};
