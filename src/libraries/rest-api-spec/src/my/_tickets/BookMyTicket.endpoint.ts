import { Schema } from "effect";

import { IdEvent } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const BookMyTicketResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "BookMyTicketResponseBody" }),
  BaseResponseFor
);

// #region BookMyTicketRequestBody
const _BookMyTicketRequestBody = Schema.Struct({
  idEvent: IdEvent,
}).pipe(Schema.annotations({ identifier: "BookMyTicketRequestBody" }));

export type BookMyTicketRequestBodyContext = Schema.Schema.Context<
  typeof _BookMyTicketRequestBody
>;
export interface BookMyTicketRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _BookMyTicketRequestBody> {}
export interface BookMyTicketRequestBody
  extends Schema.Schema.Type<typeof _BookMyTicketRequestBody> {}

export const BookMyTicketRequestBody: Schema.Schema<
  BookMyTicketRequestBody,
  BookMyTicketRequestBodyEncoded
> = _BookMyTicketRequestBody;
// #endregion BookMyTicketRequestBody

export const BookMyTicketResponse = [
  {
    content: BookMyTicketResponseBody.pipe(
      Schema.annotations({ description: "My ticket" })
    ),
    status: 200 as const,
  },
  {
    content: Schema.String.pipe(
      Schema.annotations({ description: "Event not found" })
    ),
    status: 404 as const,
  },
] as const;

export const BookMyTicketEndpoint = HttpApiEndpoint.post(
  "bookMyTicket",
  "/my/tickets"
).setPayload(BookMyTicketRequestBody);
