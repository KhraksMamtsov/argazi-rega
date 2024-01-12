import { Schema } from "@effect/schema";

export const VisitorIdSymbol: unique symbol = Symbol.for("VisitorIdSymbol");
export const VisitorIdSchema = Schema.UUID.pipe(
  Schema.brand(VisitorIdSymbol),
  Schema.identifier("VisitorIdSchema"),
);

export type VisitorId = Schema.Schema.To<typeof VisitorIdSchema>;
