import { Schema } from "effect";

export const IdTransportOnEventSymbol: unique symbol = Symbol.for(
  "IdTransportOnEventSymbol"
);
export const IdTransportOnEvent = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdTransportOnEvent" }),
  Schema.brand(IdTransportOnEventSymbol)
);
