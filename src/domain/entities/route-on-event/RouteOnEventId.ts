import { Schema } from "@effect/schema";

export const RouteOnEventIdSymbol: unique symbol = Symbol.for(
  "RouteOnEventIdSymbol",
);
export const RouteOnEventIdSchema = Schema.UUID.pipe(
  Schema.brand(RouteOnEventIdSymbol),
  Schema.identifier("RouteOnEventIdSchema"),
);
