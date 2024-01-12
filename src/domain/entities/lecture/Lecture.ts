import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { LectureIdSchema } from "./LectureId.js";
import { EventIdSchema } from "../event/EventId.js";
import { PriceSchema } from "../../value-objects/Price.js";

const _LectureSchema = Schema.struct({
  id: LectureIdSchema,
  idEvent: EventIdSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  dateStart: Schema.Date,
  dateFinish: Schema.option(Schema.Date),
  priceDay: PriceSchema,
  priceLecture: PriceSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("LectureSchema"),
);

export interface LectureFrom
  extends Schema.Schema.From<typeof _LectureSchema> {}
export interface Lecture extends Schema.Schema.To<typeof _LectureSchema> {}

export const LectureSchema: Schema.Schema<LectureFrom, Lecture> =
  _LectureSchema;
