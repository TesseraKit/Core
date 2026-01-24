/**
 * @module schema/base/factory
 * @description Factory functions for creating entity schemas
 */

import { Schema as S } from "@effect/schema";
import { BaseEntity, BaseEntityWithSoftDelete } from "./entity";

/**
 * Options for creating an entity schema
 */
export interface EntitySchemaOptions {
  /**
   * Enable soft delete fields
   * @default false
   */
  readonly softDelete?: boolean;

  /**
   * Schema description
   */
  readonly description?: string;

  /**
   * Example values for documentation
   */
  readonly examples?: readonly unknown[];
}

/**
 * Creates a new entity schema by extending the base entity
 *
 * @param name - Entity name (used for identifier and title)
 * @param fields - Additional fields specific to this entity
 * @param options - Optional configuration
 * @returns A new schema extending BaseEntity
 *
 * @example
 * ```ts
 * const PersonSchema = createEntitySchema("Person", {
 *   firstName: S.String.pipe(S.nonEmpty()),
 *   lastName: S.String.pipe(S.nonEmpty()),
 *   birthDate: S.optional(S.Date),
 * }, { softDelete: true });
 *
 * type Person = S.Schema.Type<typeof PersonSchema>;
 * ```
 */
export const createEntitySchema = <F extends S.Struct.Fields>(
  name: string,
  fields: F,
  options: EntitySchemaOptions = {},
): S.extend<
  typeof BaseEntity | typeof BaseEntityWithSoftDelete,
  S.Struct<F>
> => {
  const base = options.softDelete ? BaseEntityWithSoftDelete : BaseEntity;
  const extendedSchema = S.extend(base, S.Struct(fields));

  const annotations: Record<string, unknown> = {
    identifier: name,
    title: name,
  };

  if (options.description) {
    annotations.description = options.description;
  }

  if (options.examples) {
    annotations.examples = options.examples;
  }

  return extendedSchema.annotations(annotations) as S.extend<
    typeof BaseEntity | typeof BaseEntityWithSoftDelete,
    S.Struct<F>
  >;
};
