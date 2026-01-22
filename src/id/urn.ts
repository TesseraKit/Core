/**
 * @module id/urn
 * @description URN (Uniform Resource Name) generation and parsing for entity identification
 *
 * URNs in Forge follow the format: `{app}:{entity}:{ulid}`
 *
 * - **app**: Application namespace (lowercase alphanumeric, 1-32 chars)
 * - **entity**: Entity type name (lowercase alphanumeric with hyphens, 1-64 chars)
 * - **ulid**: ULID identifier (26 chars, Crockford's Base32)
 *
 * @example
 * ```ts
 * import { Urn } from "@tesserakit/core/id";
 *
 * // Create a URN
 * const personId = Urn.create("chai", "person");
 * // => "chai:person:01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *
 * // Parse a URN
 * const parts = Urn.parse(personId);
 * // => { app: "chai", entity: "person", id: "01ARZ3NDEKTSV4RRFFQ69G5FAV" }
 *
 * // Create an app-specific generator
 * const chaiUrn = Urn.forApp("chai");
 * const gameId = chaiUrn("game");
 * ```
 */

export * from "./urn/index.js";
