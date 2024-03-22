import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTicketSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

// #region ReturnTicketResponseBody
const _ReturnTicketResponseBodySchema = TicketApiSchema.pipe(
  Schema.identifier("ReturnTicketResponseSchema"),
  BaseResponseFor
);

export type ReturnTicketResponseBodyContext = Schema.Schema.Context<
  typeof _ReturnTicketResponseBodySchema
>;
export interface ReturnTicketResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _ReturnTicketResponseBodySchema> {}
export interface ReturnTicketResponseBody
  extends Schema.Schema.Type<typeof _ReturnTicketResponseBodySchema> {}

export const ReturnTicketResponseBodySchema: Schema.Schema<
  ReturnTicketResponseBody,
  ReturnTicketResponseBodyEncoded
> = _ReturnTicketResponseBodySchema;
// #endregion ReturnTicketResponseBodySchema

// #region ReturnTicketRequestParams
const _ReturnTicketRequestParamsSchema = Schema.struct({
  idTicket: IdTicketSchema,
  idUser: IdUserSchema,
}).pipe(Schema.identifier("ReturnTicketRequestParamsSchema"));

export type ReturnTicketRequestParamsContext = Schema.Schema.Context<
  typeof _ReturnTicketRequestParamsSchema
>;
export interface ReturnTicketRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _ReturnTicketRequestParamsSchema> {}
export interface ReturnTicketRequestParams
  extends Schema.Schema.Type<typeof _ReturnTicketRequestParamsSchema> {}

export const ReturnTicketRequestParamsSchema: Schema.Schema<
  ReturnTicketRequestParams,
  ReturnTicketRequestParamsEncoded
> = _ReturnTicketRequestParamsSchema;
// #endregion ReturnTicketRequestParamsSchema

export const ReturnTicketEndpoint = ApiEndpoint.delete(
  "returnTicket",
  "/users/:idUser/tickets/:idTicket",
  {
    summary: "Return ticket for user on particular event",
  }
).pipe(
  ApiEndpoint.setResponseBody(ReturnTicketResponseBodySchema),
  ApiEndpoint.setRequestPath(ReturnTicketRequestParamsSchema)
);
