import { Schema } from "@effect/schema";

export const IdTicketMealSymbol: unique symbol =
  Symbol.for("IdTicketMealSymbol");
export const IdTicketMealSchema = Schema.UUID.pipe(
  Schema.brand(IdTicketMealSymbol),
  Schema.identifier("TicketMealIdSchema")
);
