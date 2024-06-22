import * as Schema from "@effect/schema/Schema";

import { IdEvent } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { TicketApi } from "./Ticket.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";

export const CreateTicketApi = TicketApi.pipe(
  Schema.annotations({ identifier: "CreateTicketResponse" }),
  BaseResponseFor
);

export const CreateTicketRequest = {
  body: Schema.Struct({
    idEvent: IdEvent,
  }),
  params: Schema.Struct({
    idUser: IdUser,
  }),
};

export const CreateTicketResponse = [
  {
    content: CreateTicketApi,
    status: 200 as const,
  },
  {
    content: Schema.String,
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
