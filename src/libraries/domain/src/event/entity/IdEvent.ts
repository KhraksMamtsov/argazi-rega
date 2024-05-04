import { Schema } from "@effect/schema";

export const IdEventSymbol: unique symbol = Symbol.for("IdEventSymbol");

export const IdEvent = Schema.UUID.pipe(
  Schema.identifier("IdEvent"),
  Schema.brand(IdEventSymbol)
);

export type IdEvent = Schema.Schema.Type<typeof IdEvent>;
