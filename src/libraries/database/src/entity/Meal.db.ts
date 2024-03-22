import { Schema } from "@effect/schema";
import { type Meal as _Meal } from "@prisma/client";
import { Effect } from "effect";

import { IdEventSchema } from "@argazi/domain";
import { IdMealSchema } from "@argazi/domain";
import { type Meal, type MealBase, MealSchema } from "@argazi/domain";
import { MealType } from "@argazi/domain";
import { PriceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

// #region MealDb
export const _MealDbSchema = Schema.struct({
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
	_SS.satisfies.to<MealBase>(),
	Schema.extend(BaseDbSchema),
	Schema.identifier("MealDbSchema"),
	_SS.satisfies.from<_Meal>()
);

export type MealDbContext = Schema.Schema.Context<typeof _MealDbSchema>;
export interface MealDbEncoded
	extends Schema.Schema.Encoded<typeof _MealDbSchema> {}
export interface MealDb extends Schema.Schema.Type<typeof _MealDbSchema> {}

export const MealDbSchema: Schema.Schema<MealDb, MealDbEncoded> = _MealDbSchema;
// #endregion MealDbSchema

export const MealDbToDomainSchema: Schema.Schema<Meal, _Meal> = transform(
	MealDbSchema,
	MealSchema,
	Effect.succeed,
	Effect.succeed
);
