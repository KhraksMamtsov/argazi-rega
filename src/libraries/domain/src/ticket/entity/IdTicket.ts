import { Schema } from "@effect/schema";

export const IdTicketSymbol: unique symbol = Symbol.for("IdTicketSymbol");
export const IdTicket = Schema.UUID.pipe(
  Schema.identifier("IdTicket"),
  Schema.brand(IdTicketSymbol)
);

export type IdTicket = Schema.Schema.Type<typeof IdTicket>;
