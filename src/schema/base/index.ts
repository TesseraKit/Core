/**
 * @module schema/base
 * @description Internal module exports for base entity schemas
 */

export {
  Timestamps,
  Auditable,
  SoftDeletable,
  type Timestamps as TimestampsType,
  type Auditable as AuditableType,
  type SoftDeletable as SoftDeletableType,
} from "./mixins";

export {
  BaseEntity,
  BaseEntityWithSoftDelete,
  type BaseEntity as BaseEntityType,
  type BaseEntityWithSoftDelete as BaseEntityWithSoftDeleteType,
} from "./entity";

export { createEntitySchema, type EntitySchemaOptions } from "./factory";

export {
  type EntityType,
  type EntityEncoded,
  type EntityCreateInput,
  type EntityUpdateInput,
} from "./types";
