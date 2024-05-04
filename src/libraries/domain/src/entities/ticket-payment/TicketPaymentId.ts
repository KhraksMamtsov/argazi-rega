import { Schema } from "@effect/schema";

export const IdTicketPaymentSymbol: unique symbol = Symbol.for(
  "IdTicketPaymentSymbol"
);
export const IdTicketPayment = Schema.UUID.pipe(
  Schema.brand(IdTicketPaymentSymbol),
  Schema.identifier("IdTicketPayment")
);
