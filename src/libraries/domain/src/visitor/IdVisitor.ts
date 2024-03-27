import { Schema } from "@effect/schema";

export const IdVisitorSymbol: unique symbol = Symbol.for("IdVisitorSymbol");
export const IdVisitorSchema = Schema.UUID.pipe(
  Schema.identifier("IdVisitorSchema"),
  Schema.brand(IdVisitorSymbol)
);

export type IdVisitor = Schema.Schema.Type<typeof IdVisitorSchema>;
