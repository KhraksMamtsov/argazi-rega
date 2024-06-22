import { Schema } from "@effect/schema";

export const IdMealSymbol: unique symbol = Symbol.for("IdMealSymbol");

export const IdMeal = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdMeal" }),
  Schema.brand(IdMealSymbol)
);

export type IdMeal = Schema.Schema.Type<typeof IdMeal>;
