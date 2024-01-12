import { Schema } from "@effect/schema";

export const GeoPointIdSymbol: unique symbol = Symbol.for("GeoPointId");

export const GeoPointIdSchema = Schema.UUID.pipe(
  Schema.brand(GeoPointIdSymbol),
  Schema.identifier("GeoPointIdSchema"),
);

export type GeoPointId = Schema.Schema.To<typeof GeoPointIdSchema>;
