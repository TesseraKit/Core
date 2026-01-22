/**
 * @module id/urn/validators
 * @description Internal validation utilities for URN components
 */

import { Effect } from "effect";
import { APP_PATTERN, ENTITY_PATTERN } from "./constants.js";
import { UrnError } from "./errors.js";

/**
 * Validates an app name
 */
export const validateApp = (app: string): Effect.Effect<string, UrnError> => {
  if (!APP_PATTERN.test(app)) {
    return Effect.fail(
      new UrnError(
        `Invalid app name "${app}". Must be 1-32 lowercase alphanumeric characters starting with a letter.`,
        "INVALID_APP",
        app,
      ),
    );
  }
  return Effect.succeed(app);
};

/**
 * Validates an entity name
 */
export const validateEntity = (
  entity: string,
): Effect.Effect<string, UrnError> => {
  if (!ENTITY_PATTERN.test(entity)) {
    return Effect.fail(
      new UrnError(
        `Invalid entity name "${entity}". Must be 1-64 lowercase alphanumeric characters (hyphens allowed) starting with a letter.`,
        "INVALID_ENTITY",
        entity,
      ),
    );
  }
  return Effect.succeed(entity);
};
