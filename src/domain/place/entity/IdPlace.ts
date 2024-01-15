import { Schema } from "@effect/schema";

export const IdPlaceSymbol: unique symbol = Symbol.for("IdPlaceSymbol");

export const IdPlaceSchema = Schema.UUID.pipe(
	Schema.identifier("IdPlaceSchema"),
	Schema.brand(IdPlaceSymbol)
);

export type IdPlace = Schema.Schema.To<typeof IdPlaceSchema>;
