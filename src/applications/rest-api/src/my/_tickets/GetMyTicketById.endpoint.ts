import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicket } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

// #region GetMyTicketByIdResponseBody
const _GetMyTicketByIdResponseBody = TicketApi.pipe(
  Schema.identifier("GetMyTicketByIdResponse"),
  BaseResponseFor
);

export type GetMyTicketByIdResponseBodyContext = Schema.Schema.Context<
  typeof _GetMyTicketByIdResponseBody
>;
export interface GetMyTicketByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetMyTicketByIdResponseBody> {}
export interface GetMyTicketByIdResponseBody
  extends Schema.Schema.Type<typeof _GetMyTicketByIdResponseBody> {}

export const GetMyTicketByIdResponseBody: Schema.Schema<
  GetMyTicketByIdResponseBody,
  GetMyTicketByIdResponseBodyEncoded
> = _GetMyTicketByIdResponseBody;
// #endregion GetMyTicketByIdResponseBody

// #region GetMyTicketByIdRequestParams
const _GetMyTicketByIdRequestParams = Schema.Struct({
  idTicket: IdTicket,
}).pipe(Schema.identifier("GetMyTicketByIdRequestParams"));

export type GetMyTicketByIdRequestParamsContext = Schema.Schema.Context<
  typeof _GetMyTicketByIdRequestParams
>;
export interface GetMyTicketByIdRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetMyTicketByIdRequestParams> {}
export interface GetMyTicketByIdRequestParams
  extends Schema.Schema.Type<typeof _GetMyTicketByIdRequestParams> {}

export const GetMyTicketByIdRequestParams: Schema.Schema<
  GetMyTicketByIdRequestParams,
  GetMyTicketByIdRequestParamsEncoded
> = _GetMyTicketByIdRequestParams;
// #endregion GetMyTicketByIdRequestParams

export const GetMyTicketByIdEndpoint = ApiEndpoint.get(
  "getMyTicketById",
  "/my/tickets/:idTicket",
  {
    summary: "Get user's ticket",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMyTicketByIdResponseBody),
  ApiEndpoint.setRequestPath(GetMyTicketByIdRequestParams),
  ApiEndpoint.setSecurity(BearerAuth)
);
