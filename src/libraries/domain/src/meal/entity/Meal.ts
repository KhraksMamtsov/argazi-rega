import { Schema } from "@effect/schema";

import { IdMeal } from "./IdMeal.js";
import { MealTypeSchema } from "./MealType.js";

import { Base } from "../../entities/common/Base.js";
import { IdEvent } from "../../event/entity/IdEvent.js";
import { Price } from "../../value-objects/Price.js";

export const MealBase = Schema.Struct({
  dateFinish: Schema.OptionFromSelf(Schema.ValidDateFromSelf),
  dateStart: Schema.ValidDateFromSelf,
  id: IdMeal,
  idEvent: IdEvent,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  price: Price,
  type: MealTypeSchema,
  description: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(Schema.annotations({ identifier: "MealBase" }));

export type MealBase = Schema.Schema.Type<typeof MealBase>;

export const Meal = MealBase.pipe(
  //
  Schema.extend(Base),
  Schema.typeSchema,
  Schema.annotations({ identifier: "Meal" })
);

export interface MealFrom extends Schema.Schema.Encoded<typeof Meal> {}
export interface Meal extends Schema.Schema.Type<typeof Meal> {}
