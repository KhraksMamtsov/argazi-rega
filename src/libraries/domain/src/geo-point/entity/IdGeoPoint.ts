import { Schema } from "@effect/schema";

export const IdGeoPointSymbol: unique symbol = Symbol.for("IdGeoPointSymbol");

export const IdGeoPoint = Schema.UUID.pipe(
  Schema.identifier("IdGeoPoint"),
  Schema.brand(IdGeoPointSymbol)
);

export type IdGeoPoint = Schema.Schema.Type<typeof IdGeoPoint>;
