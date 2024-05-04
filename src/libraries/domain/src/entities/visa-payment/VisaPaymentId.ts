import { Schema } from "@effect/schema";

export const IdVisaPaymentSymbol: unique symbol = Symbol.for(
  "IdVisaPaymentSymbol"
);
export const IdVisaPayment = Schema.UUID.pipe(
  Schema.brand(IdVisaPaymentSymbol),
  Schema.identifier("IdVisaPayment")
);
