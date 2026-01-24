/**
 * @module id/urn/api
 * @description Public API for URN creation and manipulation
 */

import { Effect, pipe, Option } from "effect";
import { Ulid } from "../ulid/api";
import { type UlidType } from "../ulid/types";
import { APP_PATTERN, ENTITY_PATTERN, URN_PATTERN } from "./constants";
import {
  type UrnType,
  type UrnComponents,
  type UrnCreateOptions,
  UrnSchema,
} from "./types";
import { UrnError } from "./errors";
import { validateApp, validateEntity } from "./validators";

/**
 * URN creation and manipulation utilities
 */
export const Urn = {
  /**
   * Regular expression for validating URN strings
   */
  pattern: URN_PATTERN,

  /**
   * Effect Schema for URN validation
   */
  schema: UrnSchema,

  /**
   * Creates a new URN
   *
   * @param app - Application namespace
   * @param entity - Entity type name
   * @param options - Optional creation options
   * @returns A new URN string
   * @throws UrnError if app or entity names are invalid
   *
   * @example
   * ```ts
   * const personId = Urn.create("chai", "person");
   * // => "chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV"
   *
   * // With specific timestamp
   * const historicId = Urn.create("chai", "event", {
   *   timestamp: new Date("2020-01-01").getTime()
   * });
   * ```
   */
  create: (
    app: string,
    entity: string,
    options?: UrnCreateOptions,
  ): UrnType => {
    if (!APP_PATTERN.test(app)) {
      throw new UrnError(`Invalid app name "${app}"`, "INVALID_APP", app);
    }
    if (!ENTITY_PATTERN.test(entity)) {
      throw new UrnError(
        `Invalid entity name "${entity}"`,
        "INVALID_ENTITY",
        entity,
      );
    }

    const id = options?.id ?? Ulid.generate(options?.timestamp);
    return `${app}:${entity}:${id}` as UrnType;
  },

  /**
   * Creates a new URN as an Effect
   * Provides explicit error handling
   *
   * @param app - Application namespace
   * @param entity - Entity type name
   * @param options - Optional creation options
   * @returns Effect that produces a URN or fails with UrnError
   *
   * @example
   * ```ts
   * const program = Effect.gen(function* () {
   *   const id = yield* Urn.createEffect("chai", "person");
   *   return id;
   * });
   * ```
   */
  createEffect: (
    app: string,
    entity: string,
    options?: UrnCreateOptions,
  ): Effect.Effect<UrnType, UrnError> =>
    pipe(
      Effect.all([validateApp(app), validateEntity(entity)]),
      Effect.flatMap(([validApp, validEntity]) =>
        Ulid.generateEffect(options?.timestamp).pipe(
          Effect.map(
            (id) =>
              `${validApp}:${validEntity}:${options?.id ?? id}` as UrnType,
          ),
        ),
      ),
    ),

  /**
   * Validates whether a string is a valid URN
   *
   * @param value - String to validate
   * @returns true if valid URN, false otherwise
   *
   * @example
   * ```ts
   * Urn.isValid("chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV"); // true
   * Urn.isValid("invalid"); // false
   * Urn.isValid("CHAI:person:01ARZ3NDEKTSV4RRFFQ69G5FAV"); // false (app must be lowercase)
   * ```
   */
  isValid: (value: string): value is UrnType => {
    return typeof value === "string" && URN_PATTERN.test(value);
  },

  /**
   * Parses a URN string into its components
   *
   * @param urn - URN string to parse
   * @returns Parsed URN components
   * @throws UrnError if the string is not a valid URN
   *
   * @example
   * ```ts
   * const parts = Urn.parse("chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV");
   * // => { app: "chai", entity: "person", id: "01ARZ3NDEKTSV4RRFFQ69G5FAV" }
   * ```
   */
  parse: (urn: UrnType | string): UrnComponents => {
    if (!Urn.isValid(urn)) {
      throw new UrnError(`Invalid URN format: "${urn}"`, "INVALID_URN", urn);
    }

    const [app, entity, id] = urn.split(":") as [string, string, string];
    return { app, entity, id: id as UlidType };
  },

  /**
   * Safely parses a URN string into its components using Effect
   *
   * @param value - String to parse
   * @returns Effect that succeeds with components or fails with error
   *
   * @example
   * ```ts
   * const result = Urn.parseEffect("chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV");
   * ```
   */
  parseEffect: (value: string): Effect.Effect<UrnComponents, UrnError> =>
    Urn.isValid(value)
      ? Effect.succeed(Urn.parse(value))
      : Effect.fail(
          new UrnError(`Invalid URN: "${value}"`, "PARSE_ERROR", value),
        ),

  /**
   * Safely parses a URN, returning Option instead of throwing
   *
   * @param value - String to parse
   * @returns Some(components) if valid, None if invalid
   *
   * @example
   * ```ts
   * const result = Urn.parseSafe("chai:person:01ARZ...");
   * if (Option.isSome(result)) {
   *   console.log(result.value.entity);
   * }
   * ```
   */
  parseSafe: (value: string): Option.Option<UrnComponents> => {
    if (!Urn.isValid(value)) {
      return Option.none();
    }
    return Option.some(Urn.parse(value));
  },

  /**
   * Extracts the app name from a URN
   *
   * @param urn - URN to extract from
   * @returns App name
   */
  app: (urn: UrnType): string => Urn.parse(urn).app,

  /**
   * Extracts the entity name from a URN
   *
   * @param urn - URN to extract from
   * @returns Entity name
   */
  entity: (urn: UrnType): string => Urn.parse(urn).entity,

  /**
   * Extracts the ULID from a URN
   *
   * @param urn - URN to extract from
   * @returns ULID
   */
  id: (urn: UrnType): UlidType => Urn.parse(urn).id,

  /**
   * Extracts the timestamp from a URN's ULID component
   *
   * @param urn - URN to extract timestamp from
   * @returns Unix timestamp in milliseconds
   */
  timestamp: (urn: UrnType): number => Ulid.timestamp(Urn.id(urn)),

  /**
   * Extracts the date from a URN's ULID component
   *
   * @param urn - URN to extract date from
   * @returns Date object
   */
  date: (urn: UrnType): Date => Ulid.date(Urn.id(urn)),

  /**
   * Checks if a URN belongs to a specific app
   *
   * @param urn - URN to check
   * @param app - App name to match
   * @returns true if URN belongs to the app
   *
   * @example
   * ```ts
   * Urn.isApp(personId, "chai"); // true
   * Urn.isApp(gameId, "chai"); // false (belongs to "clank")
   * ```
   */
  isApp: (urn: UrnType, app: string): boolean => Urn.app(urn) === app,

  /**
   * Checks if a URN represents a specific entity type
   *
   * @param urn - URN to check
   * @param entity - Entity name to match
   * @returns true if URN represents the entity type
   *
   * @example
   * ```ts
   * Urn.isEntity(personId, "person"); // true
   * Urn.isEntity(personId, "story"); // false
   * ```
   */
  isEntity: (urn: UrnType, entity: string): boolean =>
    Urn.entity(urn) === entity,

  /**
   * Checks if a URN matches both app and entity
   *
   * @param urn - URN to check
   * @param app - App name to match
   * @param entity - Entity name to match
   * @returns true if URN matches both
   */
  matches: (urn: UrnType, app: string, entity: string): boolean =>
    Urn.isApp(urn, app) && Urn.isEntity(urn, entity),

  /**
   * Creates an app-scoped URN generator
   * Useful for creating multiple URNs within the same app
   *
   * @param app - Application namespace
   * @returns Function that creates URNs for the given app
   *
   * @example
   * ```ts
   * const chaiUrn = Urn.forApp("chai");
   *
   * const personId = chaiUrn("person");
   * const storyId = chaiUrn("story");
   * const photoId = chaiUrn("photo");
   * ```
   */
  forApp: (app: string) => {
    // Validate app name once at creation time
    if (!APP_PATTERN.test(app)) {
      throw new UrnError(`Invalid app name "${app}"`, "INVALID_APP", app);
    }

    return (entity: string, options?: UrnCreateOptions): UrnType =>
      Urn.create(app, entity, options);
  },

  /**
   * Creates an app-scoped URN generator as an Effect
   *
   * @param app - Application namespace
   * @returns Effect that produces a URN generator function
   */
  forAppEffect: (
    app: string,
  ): Effect.Effect<
    (entity: string, options?: UrnCreateOptions) => UrnType,
    UrnError
  > =>
    validateApp(app).pipe(
      Effect.map(
        (validApp) => (entity: string, options?: UrnCreateOptions) =>
          Urn.create(validApp, entity, options),
      ),
    ),

  /**
   * Compares two URNs by their ULID (timestamp + random)
   * Useful for sorting URNs chronologically
   *
   * @param a - First URN
   * @param b - Second URN
   * @returns -1 if a < b, 0 if a === b, 1 if a > b
   */
  compare: (a: UrnType, b: UrnType): -1 | 0 | 1 =>
    Ulid.compare(Urn.id(a), Urn.id(b)),

  /**
   * Compares two URNs for equality
   *
   * @param a - First URN
   * @param b - Second URN
   * @returns true if URNs are equal
   */
  equals: (a: UrnType, b: UrnType): boolean => a === b,
} as const;
