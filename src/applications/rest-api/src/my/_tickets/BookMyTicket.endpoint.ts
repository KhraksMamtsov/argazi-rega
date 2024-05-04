import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdEvent } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

export const BookMyTicketResponseBody = TicketApi.pipe(
  Schema.identifier("BookMyTicketResponseBody"),
  BaseResponseFor
);

// #region BookMyTicketRequestBody
const _BookMyTicketRequestBody = Schema.Struct({
  idEvent: IdEvent,
}).pipe(Schema.identifier("BookMyTicketRequestBody"));

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
    content: BookMyTicketResponseBody.pipe(Schema.description("My ticket")),
    status: 200 as const,
  },
  {
    content: Schema.String.pipe(Schema.description("Event not found")),
    status: 404 as const,
  },
] as const;

export const BookMyTicketEndpoint = ApiEndpoint.post(
  "bookMyTicket",
  "/my/tickets",
  {
    summary: "Book ticket for user on particular event",
  }
).pipe(
  ApiEndpoint.setRequestBody(BookMyTicketRequestBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
