import { Schema } from "effect";

export const IdEventSymbol: unique symbol = Symbol.for("IdEventSymbol");

export const IdEvent = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdEvent" }),
  Schema.brand(IdEventSymbol)
);

export type IdEvent = Schema.Schema.Type<typeof IdEvent>;
