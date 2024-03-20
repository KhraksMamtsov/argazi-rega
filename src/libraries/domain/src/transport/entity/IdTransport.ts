import { Schema } from "@effect/schema";

export const IdTransportSymbol: unique symbol = Symbol.for("IdTransportSymbol");

export const IdTransportSchema = Schema.UUID.pipe(
	Schema.identifier("TransportIdSchema"),
	Schema.brand(IdTransportSymbol)
);
export type IdTransport = Schema.Schema.Type<typeof IdTransportSchema>;
