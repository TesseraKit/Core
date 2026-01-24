/**
 * @module schema/pagination/utils
 * @description Utility functions for pagination operations
 */

import { DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_OFFSET } from "./constants";
import {
  type PaginationParams,
  type PaginationMeta,
  type PaginatedResponseType,
} from "./types";

/**
 * Normalizes pagination parameters with defaults
 *
 * @param params - Raw pagination parameters
 * @returns Normalized parameters with defaults applied
 */
export const normalizePaginationParams = (
  params: Partial<PaginationParams> = {},
): Required<Pick<PaginationParams, "limit" | "offset">> &
  Pick<PaginationParams, "sortBy" | "sortDirection"> => ({
  limit: Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT),
  offset: params.offset ?? DEFAULT_OFFSET,
  sortBy: params.sortBy,
  sortDirection: params.sortDirection ?? "asc",
});

/**
 * Creates pagination metadata from query results
 *
 * @param total - Total number of items
 * @param limit - Items per page
 * @param offset - Current offset
 * @returns Pagination metadata
 */
export const createPaginationMeta = (
  total: number,
  limit: number,
  offset: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const hasMore = offset + limit < total;

  return {
    total,
    limit,
    offset,
    hasMore,
    totalPages,
    currentPage,
  };
};

/**
 * Creates a paginated response from data and metadata
 *
 * @param data - Array of items
 * @param total - Total count
 * @param params - Pagination parameters used
 * @returns Complete paginated response
 */
export const createPaginatedResponse = <T>(
  data: readonly T[],
  total: number,
  params: Pick<PaginationParams, "limit" | "offset">,
): PaginatedResponseType<T> => ({
  data,
  meta: createPaginationMeta(
    total,
    params.limit ?? DEFAULT_LIMIT,
    params.offset ?? DEFAULT_OFFSET,
  ),
});
