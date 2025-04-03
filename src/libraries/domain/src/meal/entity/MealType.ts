import { Schema } from "effect";

export enum MealType {
  REGULAR = "REGULAR",
  VEGETARIAN = "VEGETARIAN",
}

export const MealTypeSchema = Schema.Enums(MealType).pipe(
  Schema.annotations({ identifier: "MealType" })
);
