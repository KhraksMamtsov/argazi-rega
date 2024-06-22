import { Schema } from "@effect/schema";
import { type Meal as _Meal } from "@prisma/client";
import { Effect } from "effect";

import { IdEvent } from "@argazi/domain";
import { IdMeal } from "@argazi/domain";
import { type MealBase, Meal } from "@argazi/domain";
import { MealType } from "@argazi/domain";
import { Price } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

// #region MealDb
export const _MealDb = Schema.Struct({
  dateFinish: Schema.OptionFromNullOr(Schema.ValidDateFromSelf),
  dateStart: Schema.ValidDateFromSelf,
  id: IdMeal,
  idEvent: IdEvent,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  price: Schema.compose(BigDecimalFromPrismaDecimal, Price),
  type: Schema.transformLiterals(
    ["REGULAR", MealType.REGULAR],
    ["VEGETARIAN", MealType.VEGETARIAN]
  ),
  description: Schema.String,
}).pipe(
  _SS.satisfies.type<MealBase>(),
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "MealDb" }),
  _SS.satisfies.encoded<_Meal>()
);

export type MealDbContext = Schema.Schema.Context<typeof _MealDb>;
export interface MealDbEncoded extends Schema.Schema.Encoded<typeof _MealDb> {}
export interface MealDb extends Schema.Schema.Type<typeof _MealDb> {}

export const MealDb: Schema.Schema<MealDb, MealDbEncoded> = _MealDb;
// #endregion MealDb

export const MealDbToDomain: Schema.Schema<Meal, _Meal> = transform(
  MealDb,
  Meal,
  Effect.succeed,
  Effect.succeed
);
