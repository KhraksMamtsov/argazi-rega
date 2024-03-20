import { Schema } from "@effect/schema";

export const IdGeoPointSymbol: unique symbol = Symbol.for("IdGeoPointSymbol");

export const IdGeoPointSchema = Schema.UUID.pipe(
	Schema.identifier("IdGeoPointSchema"),
	Schema.brand(IdGeoPointSymbol)
);

export type IdGeoPoint = Schema.Schema.Type<typeof IdGeoPointSchema>;
