import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdEvent } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApi } from "../../tickets/Ticket.api.js";

// #region BookTicketResponseBody
const _BookTicketResponseBody = TicketApi.pipe(
  Schema.annotations({ identifier: "BookTicketResponseBody" }),
  BaseResponseFor
);

export type BookTicketResponseBodyContext = Schema.Schema.Context<
  typeof _BookTicketResponseBody
>;
export interface BookTicketResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketResponseBody> {}
export interface BookTicketResponseBody
  extends Schema.Schema.Type<typeof _BookTicketResponseBody> {}

export const BookTicketResponseBody: Schema.Schema<
  BookTicketResponseBody,
  BookTicketResponseBodyEncoded
> = _BookTicketResponseBody;
// #endregion BookTicketResponseBody

// #region BookTicketRequestBody
const _BookTicketRequestBody = Schema.Struct({
  idEvent: IdEvent,
}).pipe(Schema.annotations({ identifier: "BookTicketRequestBody" }));

export type BookTicketRequestBodyContext = Schema.Schema.Context<
  typeof _BookTicketRequestBody
>;
export interface BookTicketRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketRequestBody> {}
export interface BookTicketRequestBody
  extends Schema.Schema.Type<typeof _BookTicketRequestBody> {}

export const BookTicketRequestBody: Schema.Schema<
  BookTicketRequestBody,
  BookTicketRequestBodyEncoded
> = _BookTicketRequestBody;
// #endregion BookTicketRequestBody

// #region BookTicketRequestParams
const _BookTicketRequestParams = Schema.Struct({
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "BookTicketRequestParams" }));

export type BookTicketRequestParamsContext = Schema.Schema.Context<
  typeof _BookTicketRequestParams
>;
export interface BookTicketRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketRequestParams> {}
export interface BookTicketRequestParams
  extends Schema.Schema.Type<typeof _BookTicketRequestParams> {}

export const BookTicketRequestParams: Schema.Schema<
  BookTicketRequestParams,
  BookTicketRequestParamsEncoded
> = _BookTicketRequestParams;
// #endregion BookTicketRequestParams

export const BookTicketEndpoint = ApiEndpoint.post(
  "bookTicket",
  "/users/:idUser/tickets",
  {
    summary: "Book ticket for user on particular event",
  }
).pipe(
  ApiEndpoint.setRequestPath(BookTicketRequestParams),
  ApiEndpoint.setRequestBody(BookTicketRequestBody),
  ApiEndpoint.setResponse(ApiResponse.make(200, BookTicketResponseBody)),
  ApiEndpoint.addResponse(
    ApiResponse.make(
      400,
      Schema.String.pipe(
        Schema.annotations({ description: "UserSubscriptions not found" })
      )
    )
  )
);
