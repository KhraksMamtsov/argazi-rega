import { Schema } from "@effect/schema";

export const TicketMealIdSymbol: unique symbol =
	Symbol.for("TicketMealIdSymbol");
export const TicketMealIdSchema = Schema.UUID.pipe(
	Schema.brand(TicketMealIdSymbol),
	Schema.identifier("TicketMealIdSchema")
);
