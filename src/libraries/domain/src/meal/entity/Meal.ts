import { Schema } from "@effect/schema";

import { IdMealSchema } from "./IdMeal.js";
import { MealTypeSchema } from "./MealType.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";

export const MealBaseSchema = Schema.Struct({
  dateFinish: Schema.OptionFromSelf(Schema.ValidDateFromSelf),
  dateStart: Schema.ValidDateFromSelf,
  id: IdMealSchema,
  idEvent: IdEventSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  price: PriceSchema,
  type: MealTypeSchema,
  description: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(Schema.identifier("MealBaseSchema"));

export type MealBase = Schema.Schema.Type<typeof MealBaseSchema>;

export const MealSchema = MealBaseSchema.pipe(
  //
  Schema.extend(BaseSchema),
  Schema.typeSchema,
  Schema.identifier("MealSchema")
);

export interface MealFrom extends Schema.Schema.Encoded<typeof MealSchema> {}
export interface Meal extends Schema.Schema.Type<typeof MealSchema> {}
