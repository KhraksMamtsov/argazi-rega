import { Schema } from "effect";

import { IdTicket } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region GetMyTicketByIdResponseBody
const _GetMyTicketByIdResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "GetMyTicketByIdResponse" }),
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
}).pipe(Schema.annotations({ identifier: "GetMyTicketByIdRequestParams" }));

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

export const GetMyTicketByIdEndpoint = HttpApiEndpoint.get(
  "getMyTicketById",
  "/my/tickets/:idTicket"
)
  .setPath(GetMyTicketByIdRequestParams)
  .addSuccess(GetMyTicketByIdResponseBody);
