import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const GetMyTicketsResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("GetMyTicketsResponseSchema"),
	BaseResponseManyFor
);

export const GetMyTicketsResponse = GetMyTicketsResponseSchema.pipe(
	Schema.description("UserTickets")
);

export const GetMyTicketsEndpoint = Api.get(
	"getMyTickets",
	"/my/tickets",
	{
		response: GetMyTicketsResponse,
	},
	{
		security: BearerAuth,
		summary: "Get user's tickets",
	}
);
