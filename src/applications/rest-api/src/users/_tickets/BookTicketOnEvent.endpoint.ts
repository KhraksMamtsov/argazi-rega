import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdEventSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region BookTicketResponseBody
const _BookTicketResponseBodySchema = TicketApiSchema.pipe(
  Schema.identifier("BookTicketResponseBodySchema"),
  BaseResponseFor
);

export type BookTicketResponseBodyContext = Schema.Schema.Context<
  typeof _BookTicketResponseBodySchema
>;
export interface BookTicketResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketResponseBodySchema> {}
export interface BookTicketResponseBody
  extends Schema.Schema.Type<typeof _BookTicketResponseBodySchema> {}

export const BookTicketResponseBodySchema: Schema.Schema<
  BookTicketResponseBody,
  BookTicketResponseBodyEncoded
> = _BookTicketResponseBodySchema;
// #endregion BookTicketResponseBodySchema

// #region BookTicketRequestBody
const _BookTicketRequestBodySchema = Schema.struct({
  idEvent: IdEventSchema,
}).pipe(Schema.identifier("BookTicketRequestBodySchema"));

export type BookTicketRequestBodyContext = Schema.Schema.Context<
  typeof _BookTicketRequestBodySchema
>;
export interface BookTicketRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketRequestBodySchema> {}
export interface BookTicketRequestBody
  extends Schema.Schema.Type<typeof _BookTicketRequestBodySchema> {}

export const BookTicketRequestBodySchema: Schema.Schema<
  BookTicketRequestBody,
  BookTicketRequestBodyEncoded
> = _BookTicketRequestBodySchema;
// #endregion BookTicketRequestBodySchema

// #region BookTicketRequestParams
const _BookTicketRequestParamsSchema = Schema.struct({
  idUser: IdUserSchema,
}).pipe(Schema.identifier("BookTicketRequestParamsSchema"));

export type BookTicketRequestParamsContext = Schema.Schema.Context<
  typeof _BookTicketRequestParamsSchema
>;
export interface BookTicketRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketRequestParamsSchema> {}
export interface BookTicketRequestParams
  extends Schema.Schema.Type<typeof _BookTicketRequestParamsSchema> {}

export const BookTicketRequestParamsSchema: Schema.Schema<
  BookTicketRequestParams,
  BookTicketRequestParamsEncoded
> = _BookTicketRequestParamsSchema;
// #endregion BookTicketRequestParamsSchema

export const BookTicketEndpoint = ApiEndpoint.post(
  "bookTicket",
  "/users/:idUser/tickets",
  {
    summary: "Book ticket for user on particular event",
  }
).pipe(
  ApiEndpoint.setRequestPath(BookTicketRequestParamsSchema),
  ApiEndpoint.setRequestBody(BookTicketRequestBodySchema),
  ApiEndpoint.setResponse(ApiResponse.make(200, BookTicketResponseBodySchema)),
  ApiEndpoint.addResponse(
    ApiResponse.make(
      400,
      Schema.string.pipe(Schema.description("UserSubscriptions not found"))
    )
  )
);
