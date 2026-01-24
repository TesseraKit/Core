/**
 * @module schema/base/types
 * @description Type utilities for entity schemas
 */

import { Schema as S } from "@effect/schema";
import { type UrnType } from "../../id";

/**
 * Extracts the TypeScript type from an entity schema
 */
export type EntityType<T extends S.Schema.Any> = S.Schema.Type<T>;

/**
 * Extracts the encoded (JSON) type from an entity schema
 */
export type EntityEncoded<T extends S.Schema.Any> = S.Schema.Encoded<T>;

/**
 * Type for entity creation input (omits auto-generated fields)
 */
export type EntityCreateInput<T extends S.Schema.Any> = Omit<
  S.Schema.Type<T>,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "createdBy"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy"
  | "isDeleted"
>;

/**
 * Type for entity update input (partial fields, requires id)
 */
export type EntityUpdateInput<T extends S.Schema.Any> = Partial<
  Omit<S.Schema.Type<T>, "id" | "createdAt" | "createdBy">
> & {
  readonly id: UrnType;
};
