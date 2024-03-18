import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region GetMyTicketsResponseBody
const _GetMyTicketsResponseBodySchema = TicketApiSchema.pipe(
	Schema.identifier("GetMyTicketsResponseSchema"),
	BaseResponseManyFor
);

export type GetMyTicketsResponseBodyContext = Schema.Schema.Context<
	typeof _GetMyTicketsResponseBodySchema
>;
export interface GetMyTicketsResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetMyTicketsResponseBodySchema> {}
export interface GetMyTicketsResponseBody
	extends Schema.Schema.Type<typeof _GetMyTicketsResponseBodySchema> {}

export const GetMyTicketsResponseBodySchema: Schema.Schema<
	GetMyTicketsResponseBody,
	GetMyTicketsResponseBodyEncoded
> = _GetMyTicketsResponseBodySchema;
// #endregion GetMyTicketsResponseBodySchema

export const GetMyTicketsEndpoint = ApiEndpoint.get(
	"getMyTickets",
	"/my/tickets",
	{
		summary: "Get user's tickets",
	}
).pipe(
	ApiEndpoint.setRequestBody(GetMyTicketsResponseBodySchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
