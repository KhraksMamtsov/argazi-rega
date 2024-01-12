import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { PlaceIdSchema } from "../place/PlaceId.js";
import { EventIdSchema } from "./EventId.js";
import { PriceSchema } from "../../value-objects/Price.js";

const _EventSchema = Schema.struct({
  id: EventIdSchema,
  idPlace: PlaceIdSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  dateStart: Schema.Date,
  dateFinish: Schema.Date,
  priceDay: PriceSchema,
  priceEvent: PriceSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("EventSchema"),
);

export interface EventFrom extends Schema.Schema.From<typeof _EventSchema> {}
export interface Event extends Schema.Schema.To<typeof _EventSchema> {}

export const EventSchema: Schema.Schema<EventFrom, Event> = _EventSchema;
