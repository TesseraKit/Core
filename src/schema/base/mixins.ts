/**
 * @module schema/base/mixins
 * @description Reusable schema mixins for entity composition
 */

import { Schema as S } from "@effect/schema";
import { UrnSchema } from "../../id";

/**
 * Timestamp fields for tracking entity creation and modification
 */
export const Timestamps = S.Struct({
  /**
   * When the entity was created
   */
  createdAt: S.Date.annotations({
    description: "Timestamp when the entity was created",
  }),

  /**
   * When the entity was last updated
   */
  updatedAt: S.Date.annotations({
    description: "Timestamp when the entity was last updated",
  }),
}).annotations({
  identifier: "Timestamps",
  title: "Timestamp Fields",
});

export type Timestamps = S.Schema.Type<typeof Timestamps>;

/**
 * Audit fields for tracking who created/modified an entity
 */
export const Auditable = S.Struct({
  /**
   * URN of the user who created the entity
   */
  createdBy: S.optional(UrnSchema).annotations({
    description: "URN of the user who created this entity",
  }),

  /**
   * URN of the user who last updated the entity
   */
  updatedBy: S.optional(UrnSchema).annotations({
    description: "URN of the user who last updated this entity",
  }),
}).annotations({
  identifier: "Auditable",
  title: "Audit Fields",
});

export type Auditable = S.Schema.Type<typeof Auditable>;

/**
 * Fields for soft delete functionality
 */
export const SoftDeletable = S.Struct({
  /**
   * When the entity was soft deleted (null if not deleted)
   */
  deletedAt: S.optional(S.Date).annotations({
    description: "Timestamp when the entity was soft deleted",
  }),

  /**
   * URN of the user who deleted the entity
   */
  deletedBy: S.optional(UrnSchema).annotations({
    description: "URN of the user who deleted this entity",
  }),

  /**
   * Whether the entity is currently deleted
   */
  isDeleted: S.optional(S.Boolean).annotations({
    description: "Whether the entity has been soft deleted",
    default: false,
  }),
}).annotations({
  identifier: "SoftDeletable",
  title: "Soft Delete Fields",
});

export type SoftDeletable = S.Schema.Type<typeof SoftDeletable>;
