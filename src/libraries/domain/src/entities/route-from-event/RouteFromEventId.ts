import { Schema } from "effect";

export const IdRouteFromEventSymbol: unique symbol = Symbol.for(
  "RouteFromEventIdSymbol"
);
export const IdRouteFromEvent = Schema.UUID.pipe(
  Schema.brand(IdRouteFromEventSymbol),
  Schema.annotations({ identifier: "IdRouteFromEvent" })
);
