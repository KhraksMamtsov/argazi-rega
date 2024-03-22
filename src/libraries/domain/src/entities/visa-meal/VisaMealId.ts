import { Schema } from "@effect/schema";

export const VisaMealIdSymbol: unique symbol = Symbol.for("VisaMealIdSymbol");
export const VisaMealIdSchema = Schema.UUID.pipe(
  Schema.brand(VisaMealIdSymbol),
  Schema.identifier("VisaMealIdSchema")
);
