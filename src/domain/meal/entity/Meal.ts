import { Schema } from "@effect/schema";

import { IdMealSchema } from "./IdMeal.js";
import { MealTypeSchema } from "./MealType.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";

export const MealBaseSchema = Schema.struct({
	dateFinish: Schema.optionFromSelf(Schema.ValidDateFromSelf),
	dateStart: Schema.ValidDateFromSelf,
	id: IdMealSchema,
	idEvent: IdEventSchema,
	name: Schema.Trim.pipe(Schema.nonEmpty()),
	price: PriceSchema,
	type: MealTypeSchema,
}).pipe(Schema.identifier("MealBaseSchema"));

export type MealBase = Schema.Schema.To<typeof MealBaseSchema>;

export const MealSchema = MealBaseSchema.pipe(
	//
	Schema.extend(BaseSchema),
	Schema.to,
	Schema.identifier("MealSchema")
);

export type MealFrom = Schema.Schema.From<typeof MealSchema>;
export type Meal = Schema.Schema.To<typeof MealSchema>;
