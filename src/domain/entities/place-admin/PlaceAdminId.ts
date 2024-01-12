import { Schema } from "@effect/schema";

export const PlaceAdminIdSymbol: unique symbol = Symbol.for("PlaceAdminId");

export const PlaceAdminIdSchema = Schema.UUID.pipe(
  Schema.brand(PlaceAdminIdSymbol),
  Schema.identifier("PlaceAdminIdSchema"),
);

export type PlaceAdminId = Schema.Schema.To<typeof PlaceAdminIdSchema>;
