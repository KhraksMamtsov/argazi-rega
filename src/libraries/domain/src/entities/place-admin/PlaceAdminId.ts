import { Schema } from "@effect/schema";

export const IdPlaceAdminSymbol: unique symbol =
  Symbol.for("IdPlaceAdminSymbol");

export const IdPlaceAdmin = Schema.UUID.pipe(
  Schema.brand(IdPlaceAdminSymbol),
  Schema.identifier("IdPlaceAdmin")
);

export type IdPlaceAdmin = Schema.Schema.Type<typeof IdPlaceAdmin>;
