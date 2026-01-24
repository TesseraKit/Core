/**
 * @module id/urn/types
 * @description Type definitions and schemas for URN
 */

import { Brand } from "effect";
import { Schema as S } from "@effect/schema";
import { ULID_PATTERN } from "../ulid/constants";
import { type UlidType } from "../ulid/types";
import { APP_PATTERN, ENTITY_PATTERN, URN_PATTERN } from "./constants";

/**
 * Branded type for URN strings
 * Provides type-level distinction from regular strings
 */
export type UrnType = string & Brand.Brand<"Urn">;

/**
 * Components extracted from a URN
 */
export interface UrnComponents {
  /** Application namespace */
  readonly app: string;
  /** Entity type name */
  readonly entity: string;
  /** ULID identifier */
  readonly id: UlidType;
}

/**
 * Options for URN creation
 */
export interface UrnCreateOptions {
  /** Specific timestamp for the ULID (defaults to now) */
  readonly timestamp?: number;
  /** Pre-generated ULID to use */
  readonly id?: UlidType;
}

/**
 * Schema for app name validation
 */
export const AppNameSchema = S.String.pipe(
  S.pattern(APP_PATTERN),
  S.annotations({
    identifier: "AppName",
    title: "Application Name",
    description:
      "Lowercase alphanumeric string, 1-32 characters, starting with a letter",
    examples: ["chai", "clank", "myapp123"],
  }),
);

/**
 * Schema for entity name validation
 */
export const EntityNameSchema = S.String.pipe(
  S.pattern(ENTITY_PATTERN),
  S.annotations({
    identifier: "EntityName",
    title: "Entity Name",
    description:
      "Lowercase alphanumeric string with hyphens, 1-64 characters, starting with a letter",
    examples: ["person", "game", "user-profile", "family-tree-node"],
  }),
);

/**
 * Effect Schema for URN validation and parsing
 */
export const UrnSchema: S.Schema<UrnType, string> = S.String.pipe(
  S.pattern(URN_PATTERN),
  S.brand("Urn"),
  S.annotations({
    identifier: "Urn",
    title: "Uniform Resource Name",
    description: "Unique identifier in format {app}:{entity}:{ulid}",
    examples: ["chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV" as UrnType],
  }),
);

/**
 * Schema for URN components
 */
export const UrnComponentsSchema = S.Struct({
  app: AppNameSchema,
  entity: EntityNameSchema,
  id: S.String.pipe(S.pattern(ULID_PATTERN)) as unknown as S.Schema<
    UlidType,
    string
  >,
}).annotations({
  identifier: "UrnComponents",
  title: "URN Components",
  description: "Parsed components of a URN",
});
