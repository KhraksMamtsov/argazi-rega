import { Schema } from "effect";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region GetMyTicketsResponseBody
const _GetMyTicketsResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "GetMyTicketsResponse" }),
  BaseResponseManyFor
);

export type GetMyTicketsResponseBodyContext = Schema.Schema.Context<
  typeof _GetMyTicketsResponseBody
>;
export interface GetMyTicketsResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetMyTicketsResponseBody> {}
export interface GetMyTicketsResponseBody
  extends Schema.Schema.Type<typeof _GetMyTicketsResponseBody> {}

export const GetMyTicketsResponseBody: Schema.Schema<
  GetMyTicketsResponseBody,
  GetMyTicketsResponseBodyEncoded
> = _GetMyTicketsResponseBody;
// #endregion GetMyTicketsResponseBody

export const GetMyTicketsEndpoint = HttpApiEndpoint.get(
  "getMyTickets",
  "/my/tickets"
).addSuccess(GetMyTicketsResponseBody);
