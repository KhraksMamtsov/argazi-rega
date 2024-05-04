import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicket } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

// #region GetUserTicketByIdResponseBody
const _GetUserTicketByIdResponseBody = TicketApi.pipe(
  Schema.identifier("_GetUserTicketByIdResponseBody"),
  BaseResponseFor
);

export type GetUserTicketByIdResponseBodyContext = Schema.Schema.Context<
  typeof _GetUserTicketByIdResponseBody
>;
export interface GetUserTicketByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetUserTicketByIdResponseBody> {}
export interface GetUserTicketByIdResponseBody
  extends Schema.Schema.Type<typeof _GetUserTicketByIdResponseBody> {}

export const GetUserTicketByIdResponseBody: Schema.Schema<
  GetUserTicketByIdResponseBody,
  GetUserTicketByIdResponseBodyEncoded
> = _GetUserTicketByIdResponseBody;
// #endregion GetUserTicketByIdResponseBody

// #region GetUserTicketByIdRequestParams
const _GetUserTicketByIdRequestParams = Schema.Struct({
  idTicket: IdTicket,
  idUser: IdUser,
}).pipe(Schema.identifier("GetUserTicketByIdRequestParams"));

export type GetUserTicketByIdRequestParamsContext = Schema.Schema.Context<
  typeof _GetUserTicketByIdRequestParams
>;
export interface GetUserTicketByIdRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetUserTicketByIdRequestParams> {}
export interface GetUserTicketByIdRequestParams
  extends Schema.Schema.Type<typeof _GetUserTicketByIdRequestParams> {}

export const GetUserTicketByIdRequestParams: Schema.Schema<
  GetUserTicketByIdRequestParams,
  GetUserTicketByIdRequestParamsEncoded
> = _GetUserTicketByIdRequestParams;
// #endregion GetUserTicketByIdRequestParams

export const GetUserTicketByIdEndpoint = ApiEndpoint.get(
  "getUserTicketById",
  "/users/:idUser/tickets/:idTicket",
  {
    summary: "Get user's ticket",
  }
).pipe(
  ApiEndpoint.setRequestPath(GetUserTicketByIdRequestParams),
  ApiEndpoint.setResponseBody(GetUserTicketByIdResponseBody)
);
