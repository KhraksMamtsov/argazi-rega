import { Schema } from "@effect/schema";

export const IdVisaMealSymbol: unique symbol = Symbol.for("IdVisaMealSymbol");
export const IdVisaMeal = Schema.UUID.pipe(
  Schema.brand(IdVisaMealSymbol),
  Schema.annotations({ identifier: "IdVisaMeal" })
);
