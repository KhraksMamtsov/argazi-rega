import { Schema } from "@effect/schema";

export const VisitorOnEventPaymentIdSymbol: unique symbol = Symbol.for(
  "VisitorOnEventPaymentIdSymbol",
);
export const VisitorOnEventPaymentIdSchema = Schema.UUID.pipe(
  Schema.brand(VisitorOnEventPaymentIdSymbol),
  Schema.identifier("VisitorOnEventPaymentIdSchema"),
);
