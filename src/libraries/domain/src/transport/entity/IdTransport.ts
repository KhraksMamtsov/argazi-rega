import { Schema } from "effect";

export const IdTransportSymbol: unique symbol = Symbol.for("IdTransportSymbol");

export const IdTransport = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdTransport" }),
  Schema.brand(IdTransportSymbol)
);
export type IdTransport = Schema.Schema.Type<typeof IdTransport>;
