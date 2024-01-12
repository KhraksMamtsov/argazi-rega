import { Schema } from "@effect/schema";
import { TransportIdSchema } from "./TransportId.js";
import { UserIdSchema } from "../user/UserId.js";
import { BaseSchema } from "../common/Base.js";

const _TransportSchema = Schema.struct({
  id: TransportIdSchema,
  idUser: UserIdSchema,
  //
  number: Schema.Trim.pipe(Schema.nonEmpty()),
  model: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  color: Schema.Trim.pipe(Schema.nonEmpty()),
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("TransportSchema"));

export interface TransportFrom
  extends Schema.Schema.From<typeof _TransportSchema> {}
export interface Transport extends Schema.Schema.To<typeof _TransportSchema> {}

export const TransportSchema: Schema.Schema<TransportFrom, Transport> =
  _TransportSchema;
