import { Schema } from "effect";

export const IdDwbnSymbol: unique symbol = Symbol.for("IdDwbnSymbol");
export const IdDwbn = Schema.String.pipe(
  Schema.annotations({ identifier: "IdDwbn" }),
  Schema.brand(IdDwbnSymbol)
);

export type IdDwbn = Schema.Schema.Type<typeof IdDwbn>;
