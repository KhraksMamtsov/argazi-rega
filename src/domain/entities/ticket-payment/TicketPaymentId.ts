import { Schema } from "@effect/schema";

export const TicketPaymentIdSymbol: unique symbol = Symbol.for(
	"TicketPaymentIdSymbol"
);
export const TicketPaymentIdSchema = Schema.UUID.pipe(
	Schema.brand(TicketPaymentIdSymbol),
	Schema.identifier("TicketPaymentIdSchema")
);
