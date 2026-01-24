/**
 * @module schema/base/entity
 * @description Base entity schemas
 */

import { Schema as S } from "@effect/schema";
import { UrnSchema } from "../../id";
import { Timestamps, Auditable, SoftDeletable } from "./mixins";

/**
 * Base entity schema that all entities should extend
 * Includes: id, timestamps, and audit fields
 */
export const BaseEntity = S.Struct({
  /**
   * Unique identifier in URN format
   */
  id: UrnSchema.annotations({
    description: "Unique identifier for the entity",
  }),
  ...Timestamps.fields,
  ...Auditable.fields,
}).annotations({
  identifier: "BaseEntity",
  title: "Base Entity",
  description: "Base schema for all Forge entities",
});

export type BaseEntity = S.Schema.Type<typeof BaseEntity>;

/**
 * Base entity with soft delete support
 */
export const BaseEntityWithSoftDelete = S.extend(
  BaseEntity,
  SoftDeletable,
).annotations({
  identifier: "BaseEntityWithSoftDelete",
  title: "Base Entity with Soft Delete",
  description: "Base schema for entities that support soft deletion",
});

export type BaseEntityWithSoftDelete = S.Schema.Type<
  typeof BaseEntityWithSoftDelete
>;
