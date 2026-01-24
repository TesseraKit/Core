/**
 * @module id/urn
 * @description Internal module exports for URN
 */

export { APP_PATTERN, ENTITY_PATTERN, URN_PATTERN } from "./constants";
export {
  type UrnType,
  type UrnComponents,
  type UrnCreateOptions,
  AppNameSchema,
  EntityNameSchema,
  UrnSchema,
  UrnComponentsSchema,
} from "./types";
export { UrnError } from "./errors";
export { Urn } from "./api";

/**
 * Type guard for checking if a value is a URN
 */
export const isUrn = Urn.isValid;
