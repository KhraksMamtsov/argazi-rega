import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdTicketSchema } from "../../../../domain/ticket/entity/IdTicket.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const GetUserTicketByIdResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("GetUserTicketByIdResponseSchema"),
	BaseResponseFor
);

export const GetUserTicketByIdRequest = {
	params: Schema.struct({
		idTicket: IdTicketSchema,
		idUser: IdUserSchema,
	}),
};

export const GetUserTicketByIdResponse = GetUserTicketByIdResponseSchema.pipe(
	Schema.description("UserTicketById")
);

export const GetUserTicketByIdEndpoint = Api.get(
	"getUserTicketById",
	"/users/:idUser/tickets/:idTicket",
	{
		request: GetUserTicketByIdRequest,
		response: GetUserTicketByIdResponse,
	},
	{
		summary: "Get user's ticket",
	}
);
