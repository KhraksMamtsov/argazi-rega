import { Schema } from "effect";

export const IdPlaceAdminSymbol: unique symbol =
  Symbol.for("IdPlaceAdminSymbol");

export const IdPlaceAdmin = Schema.UUID.pipe(
  Schema.brand(IdPlaceAdminSymbol),
  Schema.annotations({ identifier: "IdPlaceAdmin" })
);

export type IdPlaceAdmin = Schema.Schema.Type<typeof IdPlaceAdmin>;
