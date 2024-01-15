import { Schema } from "@effect/schema";
import { type Meal as _Meal } from "@prisma/client";
import { Effect } from "effect";

import { IdEventSchema } from "../../../domain/event/entity/IdEvent.js";
import { IdMealSchema } from "../../../domain/meal/entity/IdMeal.js";
import {
	type Meal,
	type MealBase,
	MealSchema,
} from "../../../domain/meal/entity/Meal.js";
import { MealType } from "../../../domain/meal/entity/MealType.js";
import { PriceSchema } from "../../../domain/value-objects/Price.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

const MealDbSchema = Schema.struct({
	dateFinish: Schema.optionFromNullable(Schema.ValidDateFromSelf),
	dateStart: Schema.ValidDateFromSelf,
	id: IdMealSchema,
	idEvent: IdEventSchema,
	name: Schema.Trim.pipe(Schema.nonEmpty()),
	price: Schema.compose(BigDecimalFromPrismaDecimal, PriceSchema),
	type: Schema.transformLiterals(
		["REGULAR", MealType.REGULAR],
		["VEGETARIAN", MealType.VEGETARIAN]
	),
}).pipe(
	satisfies.to<MealBase>(),
	Schema.extend(BaseDbSchema),
	Schema.identifier("MealDbSchema"),
	satisfies.from<_Meal>()
);

export const ToDomainSchema: Schema.Schema<Meal, _Meal> = transform(
	MealDbSchema,
	MealSchema,
	Effect.succeed,
	Effect.succeed
);
