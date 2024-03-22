import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicketSchema } from "../../../../libraries/domain/src/ticket/entity/IdTicket.js";
import { IdUserSchema } from "../../../../libraries/domain/src/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region GetUserTicketByIdResponseBody
const _GetUserTicketByIdResponseBodySchema = TicketApiSchema.pipe(
	Schema.identifier("_GetUserTicketByIdResponseBodySchema"),
	BaseResponseFor
);

export type GetUserTicketByIdResponseBodyContext = Schema.Schema.Context<
	typeof _GetUserTicketByIdResponseBodySchema
>;
export interface GetUserTicketByIdResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetUserTicketByIdResponseBodySchema> {}
export interface GetUserTicketByIdResponseBody
	extends Schema.Schema.Type<typeof _GetUserTicketByIdResponseBodySchema> {}

export const GetUserTicketByIdResponseBodySchema: Schema.Schema<
	GetUserTicketByIdResponseBody,
	GetUserTicketByIdResponseBodyEncoded
> = _GetUserTicketByIdResponseBodySchema;
// #endregion GetUserTicketByIdResponseBodySchema

// #region GetUserTicketByIdRequestParams
const _GetUserTicketByIdRequestParamsSchema = Schema.struct({
	idTicket: IdTicketSchema,
	idUser: IdUserSchema,
}).pipe(Schema.identifier("GetUserTicketByIdRequestParamsSchema"));

export type GetUserTicketByIdRequestParamsContext = Schema.Schema.Context<
	typeof _GetUserTicketByIdRequestParamsSchema
>;
export interface GetUserTicketByIdRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _GetUserTicketByIdRequestParamsSchema> {}
export interface GetUserTicketByIdRequestParams
	extends Schema.Schema.Type<typeof _GetUserTicketByIdRequestParamsSchema> {}

export const GetUserTicketByIdRequestParamsSchema: Schema.Schema<
	GetUserTicketByIdRequestParams,
	GetUserTicketByIdRequestParamsEncoded
> = _GetUserTicketByIdRequestParamsSchema;
// #endregion GetUserTicketByIdRequestParamsSchema

export const GetUserTicketByIdEndpoint = ApiEndpoint.get(
	"getUserTicketById",
	"/users/:idUser/tickets/:idTicket",
	{
		summary: "Get user's ticket",
	}
).pipe(
	ApiEndpoint.setRequestPath(GetUserTicketByIdRequestParamsSchema),
	ApiEndpoint.setResponseBody(GetUserTicketByIdResponseBodySchema)
);