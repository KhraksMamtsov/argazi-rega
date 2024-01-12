import { Schema } from "@effect/schema";

export const UserOnEventMealIdSymbol: unique symbol = Symbol.for(
  "UserOnEventMealIdSymbol",
);
export const UserOnEventMealIdSchema = Schema.UUID.pipe(
  Schema.brand(UserOnEventMealIdSymbol),
  Schema.identifier("UserOnEventMealIdSchema"),
);
