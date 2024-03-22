import { Schema } from "@effect/schema";

export const VisaPaymentIdSymbol: unique symbol = Symbol.for(
  "VisaPaymentIdSymbol"
);
export const VisaPaymentIdSchema = Schema.UUID.pipe(
  Schema.brand(VisaPaymentIdSymbol),
  Schema.identifier("VisaPaymentIdSchema")
);
