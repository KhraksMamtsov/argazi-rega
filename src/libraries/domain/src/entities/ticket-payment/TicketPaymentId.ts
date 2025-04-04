import { Schema } from "effect";

export const IdTicketPaymentSymbol: unique symbol = Symbol.for(
  "IdTicketPaymentSymbol"
);
export const IdTicketPayment = Schema.UUID.pipe(
  Schema.brand(IdTicketPaymentSymbol),
  Schema.annotations({ identifier: "IdTicketPayment" })
);
