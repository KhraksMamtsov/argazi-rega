import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { MealIdSchema } from "./MealId.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { EventIdSchema } from "../event/EventId.js";

const _MealSchema = Schema.struct({
  id: MealIdSchema,
  idEvent: EventIdSchema,
  name: Schema.Trim.pipe(Schema.nonEmpty()),
  dateStart: Schema.Date,
  dateFinish: Schema.option(Schema.Date),
  price: PriceSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("MealSchema"),
);

export interface MealFrom extends Schema.Schema.From<typeof _MealSchema> {}
export interface Meal extends Schema.Schema.To<typeof _MealSchema> {}

export const MealSchema: Schema.Schema<MealFrom, Meal> = _MealSchema;
