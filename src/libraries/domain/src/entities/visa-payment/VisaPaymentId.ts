import { Schema } from "effect";

export const IdVisaPaymentSymbol: unique symbol = Symbol.for(
  "IdVisaPaymentSymbol"
);
export const IdVisaPayment = Schema.UUID.pipe(
  Schema.brand(IdVisaPaymentSymbol),
  Schema.annotations({ identifier: "IdVisaPayment" })
);
