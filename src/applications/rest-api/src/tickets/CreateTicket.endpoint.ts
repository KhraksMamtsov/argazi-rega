import * as Schema from "@effect/schema/Schema";

import { IdEventSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

import { TicketApiSchema } from "./Ticket.api.js";

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
