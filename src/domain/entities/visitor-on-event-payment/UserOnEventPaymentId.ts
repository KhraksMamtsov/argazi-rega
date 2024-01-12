import { Schema } from "@effect/schema";

export const UserOnEventPaymentIdSymbol: unique symbol = Symbol.for(
  "UserOnEventPaymentIdSymbol",
);
export const UserOnEventPaymentIdSchema = Schema.UUID.pipe(
  Schema.brand(UserOnEventPaymentIdSymbol),
  Schema.identifier("UserOnEventPaymentIdSchema"),
);
