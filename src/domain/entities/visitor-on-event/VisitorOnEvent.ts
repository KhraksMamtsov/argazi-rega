import { Schema } from "@effect/schema";
import { VisitorOnEventIdSchema } from "./VisitorOnEventId.js";
import { BaseSchema } from "../common/Base.js";
import { EventIdSchema } from "../event/EventId.js";
import { TransportOnEventSchema } from "../transport-on-event/TransportOnEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { VisitorIdSchema } from "../visitor/VisitorId.js";

const _VisitorOnEventSchema = Schema.struct({
  id: VisitorOnEventIdSchema,
  idVisitor: VisitorIdSchema,
  idEvent: EventIdSchema,
  idTransportOnEvent: Schema.option(TransportOnEventSchema),
  //
  totalPrice: PriceSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisitorOnEventSchema"));

export interface VisitorOnEventFrom
  extends Schema.Schema.From<typeof _VisitorOnEventSchema> {}
export interface VisitorOnEvent
  extends Schema.Schema.To<typeof _VisitorOnEventSchema> {}

export const VisitorOnEventSchema: Schema.Schema<
  VisitorOnEventFrom,
  VisitorOnEvent
> = _VisitorOnEventSchema;
