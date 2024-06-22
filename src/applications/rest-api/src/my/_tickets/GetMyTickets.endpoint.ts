import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

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

export const GetMyTicketsEndpoint = ApiEndpoint.get(
  "getMyTickets",
  "/my/tickets",
  {
    summary: "Get user's tickets",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMyTicketsResponseBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
