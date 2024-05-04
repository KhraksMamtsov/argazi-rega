import { Schema } from "@effect/schema";

export const IdVisitorSymbol: unique symbol = Symbol.for("IdVisitorSymbol");
export const IdVisitor = Schema.UUID.pipe(
  Schema.identifier("IdVisitor"),
  Schema.brand(IdVisitorSymbol)
);

export type IdVisitor = Schema.Schema.Type<typeof IdVisitor>;
