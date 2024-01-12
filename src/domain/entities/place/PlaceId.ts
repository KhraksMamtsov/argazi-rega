import { Schema } from "@effect/schema";

export const PlaceIdSymbol: unique symbol = Symbol.for("PlaceId");

export const PlaceIdSchema = Schema.UUID.pipe(
  Schema.brand(PlaceIdSymbol),
  Schema.identifier("PlaceIdSchema"),
);

export type PlaceId = Schema.Schema.To<typeof PlaceIdSchema>;
