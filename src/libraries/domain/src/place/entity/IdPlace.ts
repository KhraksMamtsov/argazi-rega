import { Schema } from "@effect/schema";

export const IdPlaceSymbol: unique symbol = Symbol.for("IdPlaceSymbol");

export const IdPlace = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdPlace" }),
  Schema.brand(IdPlaceSymbol)
);

export type IdPlace = Schema.Schema.Type<typeof IdPlace>;
