import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdTicketSchema } from "../../../../domain/ticket/entity/IdTicket.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const GetMyTicketByIdResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("GetMyTicketByIdResponseSchema"),
	BaseResponseFor
);

export const GetMyTicketByIdRequest = {
	params: Schema.struct({
		idTicket: IdTicketSchema,
	}),
};

export const GetMyTicketByIdResponse = GetMyTicketByIdResponseSchema.pipe(
	Schema.description("UserTicketById")
);

export const GetMyTicketByIdEndpoint = Api.get(
	"getMyTicketById",
	"/my/tickets/:idTicket",
	{
		request: GetMyTicketByIdRequest,
		response: GetMyTicketByIdResponse,
	},
	{
		security: BearerAuth,
		summary: "Get user's ticket",
	}
);
