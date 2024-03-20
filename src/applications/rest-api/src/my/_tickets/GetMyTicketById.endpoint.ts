import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicketSchema } from "../../../../libraries/domain/src/ticket/entity/IdTicket.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region GetMyTicketByIdResponseBody
const _GetMyTicketByIdResponseBodySchema = TicketApiSchema.pipe(
	Schema.identifier("GetMyTicketByIdResponseSchema"),
	BaseResponseFor
);

export type GetMyTicketByIdResponseBodyContext = Schema.Schema.Context<
	typeof _GetMyTicketByIdResponseBodySchema
>;
export interface GetMyTicketByIdResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetMyTicketByIdResponseBodySchema> {}
export interface GetMyTicketByIdResponseBody
	extends Schema.Schema.Type<typeof _GetMyTicketByIdResponseBodySchema> {}

export const GetMyTicketByIdResponseBodySchema: Schema.Schema<
	GetMyTicketByIdResponseBody,
	GetMyTicketByIdResponseBodyEncoded
> = _GetMyTicketByIdResponseBodySchema;
// #endregion GetMyTicketByIdResponseBodySchema

// #region GetMyTicketByIdRequestParams
const _GetMyTicketByIdRequestParamsSchema = Schema.struct({
	idTicket: IdTicketSchema,
}).pipe(Schema.identifier("GetMyTicketByIdRequestParamsSchema"));

export type GetMyTicketByIdRequestParamsContext = Schema.Schema.Context<
	typeof _GetMyTicketByIdRequestParamsSchema
>;
export interface GetMyTicketByIdRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _GetMyTicketByIdRequestParamsSchema> {}
export interface GetMyTicketByIdRequestParams
	extends Schema.Schema.Type<typeof _GetMyTicketByIdRequestParamsSchema> {}

export const GetMyTicketByIdRequestParamsSchema: Schema.Schema<
	GetMyTicketByIdRequestParams,
	GetMyTicketByIdRequestParamsEncoded
> = _GetMyTicketByIdRequestParamsSchema;
// #endregion GetMyTicketByIdRequestParamsSchema

export const GetMyTicketByIdEndpoint = ApiEndpoint.get(
	"getMyTicketById",
	"/my/tickets/:idTicket",
	{
		summary: "Get user's ticket",
	}
).pipe(
	ApiEndpoint.setResponseBody(GetMyTicketByIdResponseBodySchema),
	ApiEndpoint.setRequestPath(GetMyTicketByIdRequestParamsSchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
