import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdTicket } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { Description } from "@effect/platform/OpenApi";

// #region ReturnTicketResponseBody
const _ReturnTicketResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "ReturnTicketResponse" }),
  BaseResponseFor
);

export type ReturnTicketResponseBodyContext = Schema.Schema.Context<
  typeof _ReturnTicketResponseBody
>;
export interface ReturnTicketResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _ReturnTicketResponseBody> {}
export interface ReturnTicketResponseBody
  extends Schema.Schema.Type<typeof _ReturnTicketResponseBody> {}

export const ReturnTicketResponseBody: Schema.Schema<
  ReturnTicketResponseBody,
  ReturnTicketResponseBodyEncoded
> = _ReturnTicketResponseBody;
// #endregion ReturnTicketResponseBody

// #region ReturnTicketRequestParams
const _ReturnTicketRequestParams = Schema.Struct({
  idTicket: IdTicket,
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "ReturnTicketRequestParams" }));

export type ReturnTicketRequestParamsContext = Schema.Schema.Context<
  typeof _ReturnTicketRequestParams
>;
export interface ReturnTicketRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _ReturnTicketRequestParams> {}
export interface ReturnTicketRequestParams
  extends Schema.Schema.Type<typeof _ReturnTicketRequestParams> {}

export const ReturnTicketRequestParams: Schema.Schema<
  ReturnTicketRequestParams,
  ReturnTicketRequestParamsEncoded
> = _ReturnTicketRequestParams;
// #endregion ReturnTicketRequestParams

export const ReturnTicketEndpoint = HttpApiEndpoint.del(
  "returnTicket",
  "/users/:idUser/tickets/:idTicket"
)
  .annotate(Description, "Return ticket for user on particular event")
  .setPath(ReturnTicketRequestParams)
  .addSuccess(ReturnTicketResponseBody);
