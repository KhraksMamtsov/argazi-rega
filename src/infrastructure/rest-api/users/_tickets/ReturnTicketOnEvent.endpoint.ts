import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdTicketSchema } from "../../../../domain/ticket/entity/IdTicket.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const ReturnTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("ReturnTicketResponseSchema"),
	BaseResponseFor
);

export const ReturnTicketRequest = {
	params: Schema.struct({
		idTicket: IdTicketSchema,
		idUser: IdUserSchema,
	}),
};

export const ReturnTicketResponse = ReturnTicketResponseSchema;

export const ReturnTicketEndpoint = ApiEndpoint.delete(
	"returnTicket",
	"/users/:idUser/tickets/:idTicket",
	{
		request: ReturnTicketRequest,
		response: ReturnTicketResponse,
	},
	{
		summary: "Return ticket for user on particular event",
	}
);
