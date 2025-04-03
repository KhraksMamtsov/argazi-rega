import { Schema } from "effect";

export const IdTicketSymbol: unique symbol = Symbol.for("IdTicketSymbol");
export const IdTicket = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdTicket" }),
  Schema.brand(IdTicketSymbol)
);

export type IdTicket = Schema.Schema.Type<typeof IdTicket>;
