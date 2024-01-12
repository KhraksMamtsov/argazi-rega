import { Schema } from "@effect/schema";
import { VisitorOnEventMealIdSchema } from "./VisitorOnEventMealId.js";
import { BaseSchema } from "../common/Base.js";
import { VisitorOnEventIdSchema } from "../visitor-on-event/VisitorOnEventId.js";
import { MealIdSchema } from "../meal/MealId.js";

const _VisitorOnEventMealSchema = Schema.struct({
  id: VisitorOnEventMealIdSchema,
  idVisitorOnEvent: VisitorOnEventIdSchema,
  idMeal: MealIdSchema,
}).pipe(
  Schema.extend(BaseSchema),
  Schema.identifier("VisitorOnEventMealSchema"),
);

export interface VisitorOnEventMealFrom
  extends Schema.Schema.From<typeof _VisitorOnEventMealSchema> {}
export interface VisitorOnEventMealMeal
  extends Schema.Schema.To<typeof _VisitorOnEventMealSchema> {}

export const VisitorOnEventMealSchema: Schema.Schema<
  VisitorOnEventMealFrom,
  VisitorOnEventMealMeal
> = _VisitorOnEventMealSchema;
