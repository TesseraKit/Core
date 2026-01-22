/**
 * @module id/urn/errors
 * @description Error types for URN operations
 */

/**
 * Error thrown when URN creation or parsing fails
 */
export class UrnError extends Error {
  readonly _tag = "UrnError";

  constructor(
    message: string,
    readonly code:
      | "INVALID_APP"
      | "INVALID_ENTITY"
      | "INVALID_URN"
      | "PARSE_ERROR",
    readonly value?: string,
  ) {
    super(message);
    this.name = "UrnError";
  }
}
