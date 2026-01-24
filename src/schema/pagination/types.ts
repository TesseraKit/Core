/**
 * @module schema/pagination/types
 * @description Type definitions and schemas for pagination
 */

import { Schema as S } from "@effect/schema";
import { DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_OFFSET } from "./constants";

/**
 * Sort direction enum
 */
export const SortDirection = S.Literal("asc", "desc").annotations({
  identifier: "SortDirection",
  title: "Sort Direction",
  description: "Direction for sorting results",
});

export type SortDirection = S.Schema.Type<typeof SortDirection>;

/**
 * Standard pagination parameters for list queries
 */
export const PaginationParams = S.Struct({
  /**
   * Maximum number of items to return
   * @default 20
   * @maximum 100
   */
  limit: S.optional(
    S.Number.pipe(S.int(), S.positive(), S.lessThanOrEqualTo(MAX_LIMIT)),
  ).annotations({
    description: `Maximum number of items to return (default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT})`,
    default: DEFAULT_LIMIT,
  }),

  /**
   * Number of items to skip
   * @default 0
   */
  offset: S.optional(S.Number.pipe(S.int(), S.nonNegative())).annotations({
    description: "Number of items to skip (default: 0)",
    default: DEFAULT_OFFSET,
  }),

  /**
   * Field to sort by
   */
  sortBy: S.optional(S.String).annotations({
    description: "Field name to sort by",
  }),

  /**
   * Sort direction
   * @default "asc"
   */
  sortDirection: S.optional(SortDirection).annotations({
    description: "Sort direction (default: asc)",
    default: "asc",
  }),
}).annotations({
  identifier: "PaginationParams",
  title: "Pagination Parameters",
  description: "Standard parameters for paginated list queries",
});

export type PaginationParams = S.Schema.Type<typeof PaginationParams>;

/**
 * Metadata about paginated results
 */
export const PaginationMeta = S.Struct({
  /**
   * Total number of items across all pages
   */
  total: S.Number.pipe(S.int(), S.nonNegative()).annotations({
    description: "Total number of items",
  }),

  /**
   * Number of items per page
   */
  limit: S.Number.pipe(S.int(), S.positive()).annotations({
    description: "Items per page",
  }),

  /**
   * Current offset
   */
  offset: S.Number.pipe(S.int(), S.nonNegative()).annotations({
    description: "Current offset",
  }),

  /**
   * Whether there are more items after this page
   */
  hasMore: S.Boolean.annotations({
    description: "Whether more items exist after this page",
  }),

  /**
   * Total number of pages
   */
  totalPages: S.Number.pipe(S.int(), S.nonNegative()).annotations({
    description: "Total number of pages",
  }),

  /**
   * Current page number (1-indexed)
   */
  currentPage: S.Number.pipe(S.int(), S.positive()).annotations({
    description: "Current page number (1-indexed)",
  }),
}).annotations({
  identifier: "PaginationMeta",
  title: "Pagination Metadata",
  description: "Metadata about paginated results",
});

export type PaginationMeta = S.Schema.Type<typeof PaginationMeta>;

/**
 * Creates a paginated response schema for a given item schema
 *
 * @param itemSchema - Schema for individual items
 * @param name - Optional name for the response schema
 * @returns Schema for paginated response
 *
 * @example
 * ```ts
 * const PaginatedPersons = PaginatedResponse(PersonSchema, "PaginatedPersons");
 * type PaginatedPersons = S.Schema.Type<typeof PaginatedPersons>;
 * ```
 */
export const PaginatedResponse = <I extends S.Schema.Any>(
  itemSchema: I,
  name?: string,
) =>
  S.Struct({
    /**
     * Array of items for this page
     */
    data: S.Array(itemSchema).annotations({
      description: "Items for this page",
    }),

    /**
     * Pagination metadata
     */
    meta: PaginationMeta,
  }).annotations({
    identifier: name ?? "PaginatedResponse",
    title: name ?? "Paginated Response",
    description: "Paginated list response with metadata",
  });

/**
 * Type helper for paginated responses
 */
export type PaginatedResponseType<T> = {
  readonly data: readonly T[];
  readonly meta: PaginationMeta;
};
