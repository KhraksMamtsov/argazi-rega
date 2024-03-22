import { Schema } from "@effect/schema";

export const RouteToEventIdSymbol: unique symbol = Symbol.for(
  "RouteToEventIdSymbol"
);
export const RouteToEventIdSchema = Schema.UUID.pipe(
  Schema.brand(RouteToEventIdSymbol),
  Schema.identifier("RouteToEventIdSchema")
);
