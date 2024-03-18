import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdEventSchema } from "../../../../domain/event/entity/IdEvent.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const BookTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("BookTicketResponseSchema"),
	BaseResponseFor
);

export const BookTicketRequest = {
	body: Schema.struct({
		idEvent: IdEventSchema,
	}),
	params: Schema.struct({
		idUser: IdUserSchema,
	}),
};

export const BookTicketResponse = [
	{
		content: BookTicketResponseSchema.pipe(
			Schema.description("UserSubscriptions")
		),
		status: 200 as const,
	},
	{
		content: Schema.string.pipe(
			Schema.description("UserSubscriptions not found")
		),
		status: 404 as const,
	},
] as const;

export const BookTicketEndpoint = ApiEndpoint.post(
	"bookTicket",
	"/users/:idUser/tickets",
	{
		request: BookTicketRequest,
		response: BookTicketResponse,
	},
	{
		summary: "Book ticket for user on particular event",
	}
);
