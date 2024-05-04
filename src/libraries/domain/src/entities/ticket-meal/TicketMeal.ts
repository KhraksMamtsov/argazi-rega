import { Schema } from "@effect/schema";

import { IdTicketMeal } from "./IdTicketMeal.js";

import { IdMeal } from "../../meal/entity/IdMeal.js";
import { IdTicket } from "../../ticket/entity/IdTicket.js";
import { Base } from "../common/Base.js";

const _TicketMeal = Schema.Struct({
  id: IdTicketMeal,
  idMeal: IdMeal,
  idTicket: IdTicket,
}).pipe(Schema.extend(Base), Schema.identifier("TicketMeal"));

export type TicketMealFrom = Schema.Schema.Encoded<typeof _TicketMeal>;
export type TicketMeal = Schema.Schema.Type<typeof _TicketMeal>;

export const TicketMeal: Schema.Schema<TicketMeal, TicketMealFrom> =
  _TicketMeal;
