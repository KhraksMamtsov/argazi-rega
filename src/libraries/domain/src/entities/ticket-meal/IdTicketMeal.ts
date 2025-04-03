import { Schema } from "effect";

export const IdTicketMealSymbol: unique symbol =
  Symbol.for("IdTicketMealSymbol");
export const IdTicketMeal = Schema.UUID.pipe(
  Schema.brand(IdTicketMealSymbol),
  Schema.annotations({ identifier: "IdTicketMeal" })
);
