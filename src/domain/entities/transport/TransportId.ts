import { Schema } from "@effect/schema";

export const TransportIdSymbol: unique symbol = Symbol.for("TransportIdSymbol");
export const TransportIdSchema = Schema.UUID.pipe(
  Schema.brand(TransportIdSymbol),
  Schema.identifier("TransportIdSchema"),
);
