/**
 * @module schema/crud/types
 * @description Type definitions and schemas for CRUD operations
 */

import { Schema as S } from "@effect/schema";
import { type UrnType } from "../../id/urn";
import { type PaginationParams, PaginatedResponse } from "../pagination";

/**
 * Available filter operators for queries
 */
export const FilterOperator = S.Literal(
  "eq", // Equal
  "neq", // Not equal
  "gt", // Greater than
  "gte", // Greater than or equal
  "lt", // Less than
  "lte", // Less than or equal
  "in", // In array
  "nin", // Not in array
  "contains", // String contains
  "startsWith", // String starts with
  "endsWith", // String ends with
  "isNull", // Is null
  "isNotNull", // Is not null
).annotations({
  identifier: "FilterOperator",
  title: "Filter Operator",
});

export type FilterOperator = S.Schema.Type<typeof FilterOperator>;

/**
 * A single filter condition
 */
export const FilterCondition = S.Struct({
  field: S.String,
  operator: FilterOperator,
  value: S.Unknown,
}).annotations({
  identifier: "FilterCondition",
  title: "Filter Condition",
});

export type FilterCondition = S.Schema.Type<typeof FilterCondition>;

/**
 * Query filters (array of conditions, ANDed together)
 */
export const QueryFilters = S.Array(FilterCondition).annotations({
  identifier: "QueryFilters",
  title: "Query Filters",
});

export type QueryFilters = S.Schema.Type<typeof QueryFilters>;

/**
 * Generated CRUD schemas for an entity
 */
export interface CrudSchemas<T extends S.Schema.Any> {
  /** The original entity schema */
  readonly Entity: T;

  /** Schema for create operations (omits auto-generated fields) */
  readonly CreateInput: S.Schema.Any;

  /** Schema for update operations (partial, with required id) */
  readonly UpdateInput: S.Schema<{
    id: UrnType;
    data: Partial<S.Schema.Type<T>>;
  }>;

  /** Schema for single-entity lookup */
  readonly FindByIdInput: S.Schema<{ id: UrnType }>;

  /** Schema for list queries with pagination and filters */
  readonly FindManyInput: S.Schema<{
    filters?: QueryFilters;
    pagination?: PaginationParams;
  }>;

  /** Schema for delete operations */
  readonly DeleteInput: S.Schema<{ id: UrnType }>;

  /** Schema for paginated list response */
  readonly PaginatedResponse: ReturnType<typeof PaginatedResponse>;
}
