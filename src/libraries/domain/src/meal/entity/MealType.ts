import { Schema } from "@effect/schema";

export enum MealType {
  REGULAR = "REGULAR",
  VEGETARIAN = "VEGETARIAN",
}

export const MealTypeSchema = Schema.Enums(MealType).pipe(
  Schema.identifier("MealType")
);
