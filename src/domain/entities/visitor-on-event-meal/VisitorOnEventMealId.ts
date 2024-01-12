import { Schema } from "@effect/schema";

export const VisitorOnEventMealIdSymbol: unique symbol = Symbol.for(
  "VisitorOnEventMealIdSymbol",
);
export const VisitorOnEventMealIdSchema = Schema.UUID.pipe(
  Schema.brand(VisitorOnEventMealIdSymbol),
  Schema.identifier("VisitorOnEventMealIdSchema"),
);
