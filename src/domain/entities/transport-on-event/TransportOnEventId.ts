import { Schema } from "@effect/schema";

export const TransportOnEventIdSymbol: unique symbol = Symbol.for(
  "TransportOnEventIdSymbol",
);
export const TransportOnEventIdSchema = Schema.UUID.pipe(
  Schema.brand(TransportOnEventIdSymbol),
  Schema.identifier("TransportOnEventIdSchema"),
);
