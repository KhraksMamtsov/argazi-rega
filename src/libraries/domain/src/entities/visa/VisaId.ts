import { Schema } from "@effect/schema";

export const IdVisaSymbol: unique symbol = Symbol.for("IdVisaSymbol");
export const IdVisa = Schema.UUID.pipe(
  Schema.brand(IdVisaSymbol),
  Schema.annotations({ identifier: "IdVisa" })
);
