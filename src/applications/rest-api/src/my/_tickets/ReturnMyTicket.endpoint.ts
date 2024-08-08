import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicket } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

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

export const ReturnMyTicketEndpoint = ApiEndpoint.delete(
  "returnMyTicket",
  "/my/tickets/:idTicket",
  {
    summary: "Return ticket for user on particular event",
  }
).pipe(
  ApiEndpoint.setSecurity(BearerAuth),
  ApiEndpoint.setRequestPath(ReturnMyTicketRequestParams),
  ApiEndpoint.setResponseBody(ReturnMyTicketResponseBody)
);
