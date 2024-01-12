import { Schema } from "@effect/schema";

export const MealIdSymbol: unique symbol = Symbol.for("MealId");

export const MealIdSchema = Schema.UUID.pipe(
  Schema.brand(MealIdSymbol),
  Schema.identifier("MealIdSchema"),
);

export type MealId = Schema.Schema.To<typeof MealIdSchema>;
