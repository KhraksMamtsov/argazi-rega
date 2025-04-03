import { Schema } from "effect";

import { IdTicket } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region ReturnMyTicketResponseBody
const _ReturnMyTicketResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "_ReturnMyTicketResponseBody" }),
  BaseResponseFor
);

export type ReturnMyTicketResponseBodyContext = Schema.Schema.Context<
  typeof _ReturnMyTicketResponseBody
>;
export interface ReturnMyTicketResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _ReturnMyTicketResponseBody> {}
export interface ReturnMyTicketResponseBody
  extends Schema.Schema.Type<typeof _ReturnMyTicketResponseBody> {}

export const ReturnMyTicketResponseBody: Schema.Schema<
  ReturnMyTicketResponseBody,
  ReturnMyTicketResponseBodyEncoded
> = _ReturnMyTicketResponseBody;
// #endregion ReturnMyTicketResponseBody

// #region ReturnMyTicketRequestParams
const _ReturnMyTicketRequestParams = Schema.Struct({
  idTicket: IdTicket,
}).pipe(Schema.annotations({ identifier: "ReturnMyTicketRequestParams" }));

export type ReturnMyTicketRequestParamsContext = Schema.Schema.Context<
  typeof _ReturnMyTicketRequestParams
>;
export interface ReturnMyTicketRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _ReturnMyTicketRequestParams> {}
export interface ReturnMyTicketRequestParams
  extends Schema.Schema.Type<typeof _ReturnMyTicketRequestParams> {}

export const ReturnMyTicketRequestParams: Schema.Schema<
  ReturnMyTicketRequestParams,
  ReturnMyTicketRequestParamsEncoded
> = _ReturnMyTicketRequestParams;
// #endregion ReturnMyTicketRequestParams

export const ReturnMyTicketEndpoint = HttpApiEndpoint.del(
  "returnMyTicket",
  "/my/tickets/:idTicket"
)
  .setPath(ReturnMyTicketRequestParams)
  .addSuccess(ReturnMyTicketResponseBody);
