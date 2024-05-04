import { Schema } from "@effect/schema";

export const IdPlaceSymbol: unique symbol = Symbol.for("IdPlaceSymbol");

export const IdPlace = Schema.UUID.pipe(
  Schema.identifier("IdPlace"),
  Schema.brand(IdPlaceSymbol)
);

export type IdPlace = Schema.Schema.Type<typeof IdPlace>;
