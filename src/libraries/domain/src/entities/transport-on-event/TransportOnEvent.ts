import { Schema } from "@effect/schema";

import { IdTransportOnEvent } from "./IdTransportOnEvent.js";

import { IdEvent } from "../../event/entity/IdEvent.js";
import { IdTransport } from "../../transport/entity/IdTransport.js";
import { Price } from "../../value-objects/Price.js";
import { Base } from "../common/Base.js";

const _TransportOnEvent = Schema.Struct({
  id: IdTransportOnEvent,
  idEvent: IdEvent,
  idTransport: IdTransport,
  //
  price: Price,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "TransportOnEvent" })
);

export type TransportOnEventFrom = Schema.Schema.Encoded<
  typeof _TransportOnEvent
>;
export type TransportOnEvent = Schema.Schema.Type<typeof _TransportOnEvent>;

export const TransportOnEvent: Schema.Schema<
  TransportOnEvent,
  TransportOnEventFrom
> = _TransportOnEvent;
