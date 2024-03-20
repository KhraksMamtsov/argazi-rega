import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicketSchema } from "../../../../libraries/domain/src/ticket/entity/IdTicket.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region ReturnMyTicketResponseBody
const _ReturnMyTicketResponseBodySchema = TicketApiSchema.pipe(
	Schema.identifier("_ReturnMyTicketResponseBodySchema"),
	BaseResponseFor
);

export type ReturnMyTicketResponseBodyContext = Schema.Schema.Context<
	typeof _ReturnMyTicketResponseBodySchema
>;
export interface ReturnMyTicketResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _ReturnMyTicketResponseBodySchema> {}
export interface ReturnMyTicketResponseBody
	extends Schema.Schema.Type<typeof _ReturnMyTicketResponseBodySchema> {}

export const ReturnMyTicketResponseBodySchema: Schema.Schema<
	ReturnMyTicketResponseBody,
	ReturnMyTicketResponseBodyEncoded
> = _ReturnMyTicketResponseBodySchema;
// #endregion ReturnMyTicketResponseBodySchema

// #region ReturnMyTicketRequestParams
const _ReturnMyTicketRequestParamsSchema = Schema.struct({
	idTicket: IdTicketSchema,
}).pipe(Schema.identifier("ReturnMyTicketRequestParamsSchema"));

export type ReturnMyTicketRequestParamsContext = Schema.Schema.Context<
	typeof _ReturnMyTicketRequestParamsSchema
>;
export interface ReturnMyTicketRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _ReturnMyTicketRequestParamsSchema> {}
export interface ReturnMyTicketRequestParams
	extends Schema.Schema.Type<typeof _ReturnMyTicketRequestParamsSchema> {}

export const ReturnMyTicketRequestParamsSchema: Schema.Schema<
	ReturnMyTicketRequestParams,
	ReturnMyTicketRequestParamsEncoded
> = _ReturnMyTicketRequestParamsSchema;
// #endregion ReturnMyTicketRequestParamsSchema

export const ReturnMyTicketEndpoint = ApiEndpoint.delete(
	"returnMyTicket",
	"/my/tickets/:idTicket",
	{
		summary: "Return ticket for user on particular event",
	}
).pipe(
	ApiEndpoint.setSecurity(BearerAuth),
	ApiEndpoint.setRequestPath(ReturnMyTicketRequestParamsSchema),
	ApiEndpoint.setResponseBody(ReturnMyTicketResponseBodySchema)
);
