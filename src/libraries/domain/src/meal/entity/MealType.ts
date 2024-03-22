import { Schema } from "@effect/schema";

export enum MealType {
  REGULAR = "REGULAR",
  VEGETARIAN = "VEGETARIAN",
}

export const MealTypeSchema = Schema.enums(MealType).pipe(
  Schema.identifier("MealTypeSchema")
);
