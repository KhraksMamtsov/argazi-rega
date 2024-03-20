import { Schema } from "@effect/schema";

import { IdTransportOnEventSchema } from "./IdTransportOnEvent.js";

import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { IdTransportSchema } from "../../transport/entity/IdTransport.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { BaseSchema } from "../common/Base.js";

const _TransportOnEventSchema = Schema.struct({
	id: IdTransportOnEventSchema,
	idEvent: IdEventSchema,
	idTransport: IdTransportSchema,
	//
	price: PriceSchema,
	seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("TransportOnEventSchema"));

export type TransportOnEventFrom = Schema.Schema.Encoded<
	typeof _TransportOnEventSchema
>;
export type TransportOnEvent = Schema.Schema.Type<
	typeof _TransportOnEventSchema
>;

export const TransportOnEventSchema: Schema.Schema<
	TransportOnEvent,
	TransportOnEventFrom
> = _TransportOnEventSchema;
