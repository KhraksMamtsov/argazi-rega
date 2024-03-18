import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdEventSchema } from "../../../../domain/event/entity/IdEvent.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const BookMyTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("BookMyTicketResponseSchema"),
	BaseResponseFor
);

export const BookMyTicketRequest = {
	body: Schema.struct({
		idEvent: IdEventSchema,
	}),
};

export const BookMyTicketResponse = [
	{
		content: BookMyTicketResponseSchema.pipe(Schema.description("My ticket")),
		status: 200 as const,
	},
	{
		content: Schema.string.pipe(Schema.description("Event not found")),
		status: 404 as const,
	},
] as const;

export const BookMyTicketEndpoint = ApiEndpoint.post(
	"bookMyTicket",
	"/my/tickets",
	{
		request: BookMyTicketRequest,
		response: BookMyTicketResponse,
	},
	{
		security: BearerAuth,
		summary: "Book ticket for user on particular event",
	}
);
