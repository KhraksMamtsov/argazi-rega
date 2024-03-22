import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";
import { IdTicketSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const GetUserTicketByIdCommandPayloadSchema = Schema.struct({
	idTicket: IdTicketSchema,
	idUser: IdUserSchema,
}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("GetUserTicketByIdCommandPayloadSchema")
);

export type GetUserTicketByIdCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetUserTicketByIdCommandPayloadSchema
>;

export const GetUserTicketByIdCommandSchema = BaseCausedCommandFor(
	GetUserTicketByIdCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketByIdCommandSchema"));