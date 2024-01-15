import { Schema } from "@effect/schema";

export const IdTicketSymbol: unique symbol = Symbol.for("IdTicketSymbol");
export const IdTicketSchema = Schema.UUID.pipe(
	Schema.identifier("IdTicketSchema"),
	Schema.brand(IdTicketSymbol)
);

export type IdTicket = Schema.Schema.To<typeof IdTicketSchema>;
