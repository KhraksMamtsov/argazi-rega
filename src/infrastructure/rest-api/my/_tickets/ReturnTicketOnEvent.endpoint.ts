import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdTicketSchema } from "../../../../domain/ticket/entity/IdTicket.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const ReturnMyTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("ReturnMyTicketResponseSchema"),
	BaseResponseFor
);

export const ReturnMyTicketRequest = {
	params: Schema.struct({
		idTicket: IdTicketSchema,
	}),
};

export const ReturnMyTicketResponse = ReturnMyTicketResponseSchema;

export const ReturnMyTicketEndpoint = ApiEndpoint.delete(
	"returnMyTicket",
	"/my/tickets/:idTicket",
	{
		request: ReturnMyTicketRequest,
		response: ReturnMyTicketResponse,
	},
	{
		security: BearerAuth,
		summary: "Return ticket for user on particular event",
	}
);
