import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdTicket } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { Description } from "@effect/platform/OpenApi";

// #region GetUserTicketByIdResponseBody
const _GetUserTicketByIdResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "_GetUserTicketByIdResponseBody" }),
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
}).pipe(Schema.annotations({ identifier: "GetUserTicketByIdRequestParams" }));

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

export const GetUserTicketByIdEndpoint = HttpApiEndpoint.get(
  "getUserTicketById",
  "/users/:idUser/tickets/:idTicket"
)
  .annotate(Description, "Get user's ticket")
  .setPath(GetUserTicketByIdRequestParams)
  .addSuccess(GetUserTicketByIdResponseBody);
