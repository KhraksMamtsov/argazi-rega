import { Schema } from "@effect/schema";
import { UserOnEventMealIdSchema } from "./UserOnEventMealId.js";
import { BaseSchema } from "../common/Base.js";
import { MealIdSchema } from "../meal/MealId.js";
import { UserOnEventIdSchema } from "../user-on-event/UserOnEventId.js";

const _UserOnEventMealSchema = Schema.struct({
  id: UserOnEventMealIdSchema,
  idUserOnEvent: UserOnEventIdSchema,
  idMeal: MealIdSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("UserOnEventMealSchema"));

export interface UserOnEventMealFrom
  extends Schema.Schema.From<typeof _UserOnEventMealSchema> {}
export interface UserOnEventMealMeal
  extends Schema.Schema.To<typeof _UserOnEventMealSchema> {}

export const UserOnEventMealSchema: Schema.Schema<
  UserOnEventMealFrom,
  UserOnEventMealMeal
> = _UserOnEventMealSchema;
