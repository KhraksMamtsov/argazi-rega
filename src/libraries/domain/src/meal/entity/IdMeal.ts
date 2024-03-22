import { Schema } from "@effect/schema";

export const IdMealSymbol: unique symbol = Symbol.for("IdMealSymbol");

export const IdMealSchema = Schema.UUID.pipe(
  Schema.identifier("IdMealSchema"),
  Schema.brand(IdMealSymbol)
);

export type IdMeal = Schema.Schema.Type<typeof IdMealSchema>;
