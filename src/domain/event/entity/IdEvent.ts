import { Schema } from "@effect/schema";

export const IdEventSymbol: unique symbol = Symbol.for("IdEventSymbol");

export const IdEventSchema = Schema.UUID.pipe(
	Schema.identifier("IdEventSchema"),
	Schema.brand(IdEventSymbol)
);

export type IdEvent = Schema.Schema.Type<typeof IdEventSchema>;
