import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { VisitorTypeSchema } from "./VisitorType.js";
import { VisitorIdSchema } from "./VisitorId.js";
import { UserIdSchema } from "../user/UserId.js";

const _VisitorSchema = Schema.struct({
  id: VisitorIdSchema,
  idUser: UserIdSchema,
  //
  email: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  type: VisitorTypeSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisitorSchema"));

export interface VisitorFrom
  extends Schema.Schema.From<typeof _VisitorSchema> {}
export interface Visitor extends Schema.Schema.To<typeof _VisitorSchema> {}

export const VisitorSchema: Schema.Schema<VisitorFrom, Visitor> =
  _VisitorSchema;
