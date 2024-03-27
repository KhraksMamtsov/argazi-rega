import * as Schema from "@effect/schema/Schema";

import { IdVisitorSchema } from "./IdVisitor.js";
import { VisitorTypeSchema } from "./VisitorType.js";

import { BaseSchema } from "../entities/common/Base.js";
import { IdUserSchema } from "../user/entity/IdUser.js";

// #region VisitorData
export const _VisitorDataSchema = Schema.struct({
  email: Schema.optionFromSelf(Schema.Trim.pipe(Schema.nonEmpty())),
  id: IdVisitorSchema,
  idUser: IdUserSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  type: VisitorTypeSchema,
}).pipe(Schema.identifier("VisitorDataSchema"));

export type VisitorDataContext = Schema.Schema.Context<
  typeof _VisitorDataSchema
>;
export interface VisitorDataEncoded
  extends Schema.Schema.Encoded<typeof _VisitorDataSchema> {}
export interface VisitorData
  extends Schema.Schema.Type<typeof _VisitorDataSchema> {}

export const VisitorDataSchema: Schema.Schema<VisitorData, VisitorDataEncoded> =
  _VisitorDataSchema;
// #endregion VisitorDataSchema

// #region Visitor
export const _VisitorSchema = VisitorDataSchema.pipe(
  Schema.extend(BaseSchema),
  Schema.identifier("VisitorSchema")
);

export type VisitorContext = Schema.Schema.Context<typeof _VisitorSchema>;
export interface Visitor extends Schema.Schema.Type<typeof _VisitorSchema> {}

export const VisitorSchema: Schema.Schema<Visitor> =
  Schema.typeSchema(_VisitorSchema);
// #endregion VisitorSchema
