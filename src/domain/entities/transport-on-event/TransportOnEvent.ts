import { Schema } from "@effect/schema";
import { TransportOnEventIdSchema } from "./TransportOnEventId.js";
import { BaseSchema } from "../common/Base.js";
import { TransportIdSchema } from "../transport/TransportId.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { EventIdSchema } from "../event/EventId.js";

const _TransportOnEventSchema = Schema.struct({
  id: TransportOnEventIdSchema,
  idTransport: TransportIdSchema,
  idEvent: EventIdSchema,
  //
  price: PriceSchema,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("TransportOnEventSchema"));

export interface TransportOnEventFrom
  extends Schema.Schema.From<typeof _TransportOnEventSchema> {}
export interface TransportOnEvent
  extends Schema.Schema.To<typeof _TransportOnEventSchema> {}

export const TransportOnEventSchema: Schema.Schema<
  TransportOnEventFrom,
  TransportOnEvent
> = _TransportOnEventSchema;
