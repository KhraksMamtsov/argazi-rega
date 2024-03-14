import { Schema } from "@effect/schema";

import { IdTicketSchema } from "../../../../../domain/ticket/entity/IdTicket.js";
import { IdUserSchema } from "../../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketByIdCommandPayloadSchema = Schema.struct({
	idTicket: IdTicketSchema,
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetUserTicketByIdCommandPayloadSchema")
);

export type GetUserTicketByIdCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetUserTicketByIdCommandPayloadSchema
>;

export const GetUserTicketByIdCommandSchema = BaseCausedCommandFor(
	GetUserTicketByIdCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketByIdCommandSchema"));
