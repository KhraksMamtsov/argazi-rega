import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";
import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketsCommandPayloadSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("GetUserTicketsCommandPayloadSchema")
);

export type GetUserTicketsCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetUserTicketsCommandPayloadSchema
>;

export const GetUserTicketsCommandSchema = BaseCausedCommandFor(
	GetUserTicketsCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketsCommandSchema"));
