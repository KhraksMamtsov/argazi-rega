import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicketSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

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
const _GetUserTicketByIdRequestParamsSchema = Schema.Struct({
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
