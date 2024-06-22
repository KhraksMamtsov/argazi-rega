import { Schema } from "@effect/schema";

export const IdRouteToEventSymbol: unique symbol = Symbol.for(
  "IdRouteToEventSymbol"
);
export const IdRouteToEvent = Schema.UUID.pipe(
  Schema.brand(IdRouteToEventSymbol),
  Schema.annotations({ identifier: "IdRouteToEvent" })
);
