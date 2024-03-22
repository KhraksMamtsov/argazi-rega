import * as Schema from "@effect/schema/Schema";

import { IdVisitorSchema } from "./IdVisitor.js";
import { VisitorTypeSchema } from "./VisitorType.js";

import { BaseSchema } from "../entities/common/Base.js";
import { IdUserSchema } from "../user/entity/IdUser.js";

// #region Visitor
export const _VisitorSchema = Schema.struct({
  email: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  id: IdVisitorSchema,
  idUser: IdUserSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  type: VisitorTypeSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisitorSchema"));

export type VisitorContext = Schema.Schema.Context<typeof _VisitorSchema>;
export interface VisitorEncoded
  extends Schema.Schema.Encoded<typeof _VisitorSchema> {}
export interface Visitor extends Schema.Schema.Type<typeof _VisitorSchema> {}

export const VisitorSchema: Schema.Schema<Visitor, VisitorEncoded> =
  _VisitorSchema;
// #endregion VisitorSchema
