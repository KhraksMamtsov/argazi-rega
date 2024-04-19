import { Schema } from "@effect/schema";

import { IdTicketSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketByIdCommandPayloadSchema = Schema.Struct({
  idTicket: IdTicketSchema,
  idUser: IdUserSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("GetUserTicketByIdCommandPayloadSchema")
);

export type GetUserTicketByIdCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserTicketByIdCommandPayloadSchema
>;

export const GetUserTicketByIdCommandSchema = BaseCausedCommandFor(
  GetUserTicketByIdCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketByIdCommandSchema"));
