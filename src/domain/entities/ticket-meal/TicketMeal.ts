import { Schema } from "@effect/schema";

import { TicketMealIdSchema } from "./TicketMealId.js";

import { IdMealSchema } from "../../meal/entity/IdMeal.js";
import { IdTicketSchema } from "../../ticket/entity/IdTicket.js";
import { BaseSchema } from "../common/Base.js";

const _TicketMealSchema = Schema.struct({
	id: TicketMealIdSchema,
	idMeal: IdMealSchema,
	idTicket: IdTicketSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("TicketMealSchema"));

export type TicketMealFrom = Schema.Schema.Encoded<typeof _TicketMealSchema>;
export type TicketMeal = Schema.Schema.Type<typeof _TicketMealSchema>;

export const TicketMealSchema: Schema.Schema<TicketMeal, TicketMealFrom> =
	_TicketMealSchema;
