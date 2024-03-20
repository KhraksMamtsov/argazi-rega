import * as Schema from "@effect/schema/Schema";

import { TicketApiSchema } from "./Ticket.api.js";

import { IdEventSchema } from "../../../libraries/domain/src/event/entity/IdEvent.js";
import { IdUserSchema } from "../../../libraries/domain/src/user/entity/IdUser.js";
import { BaseResponseFor } from "../BaseResponseFor.js";

export const CreateTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("CreateTicketResponseSchema"),
	BaseResponseFor
);

export const CreateTicketRequest = {
	body: Schema.struct({
		idEvent: IdEventSchema,
	}),
	params: Schema.struct({
		idUser: IdUserSchema,
	}),
};

export const CreateTicketResponse = [
	{
		content: CreateTicketResponseSchema,
		status: 200 as const,
	},
	{
		content: Schema.string,
		status: 404 as const,
	},
] as const;

// export const CreateTicketEndpoint = ApiEndpoint.post(
// 	"createTicket",
// 	"/tickets",
// 	{
// 		request: CreateTicketRequest,
// 		response: CreateTicketResponse,
// 	},
// 	{
// 		summary: "Create ticket for user on particular event",
// 	}
// );
