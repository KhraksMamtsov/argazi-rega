import { Schema } from "@effect/schema";

export const IdRouteFromEventSymbol: unique symbol = Symbol.for(
  "RouteFromEventIdSymbol"
);
export const IdRouteFromEvent = Schema.UUID.pipe(
  Schema.brand(IdRouteFromEventSymbol),
  Schema.identifier("IdRouteFromEvent")
);
