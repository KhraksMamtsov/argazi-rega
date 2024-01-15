import { Schema } from "@effect/schema";

export const IdTransportOnEventSymbol: unique symbol = Symbol.for(
	"IdTransportOnEventSymbol"
);
export const IdTransportOnEventSchema = Schema.UUID.pipe(
	Schema.identifier("IdTransportOnEventSchema"),
	Schema.brand(IdTransportOnEventSymbol)
);
