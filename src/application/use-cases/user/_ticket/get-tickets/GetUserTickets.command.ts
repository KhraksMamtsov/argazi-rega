import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketsCommandPayloadSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetUserTicketsCommandPayloadSchema")
);

export type GetUserTicketsCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetUserTicketsCommandPayloadSchema
>;

export const GetUserTicketsCommandSchema = BaseCausedCommandFor(
	GetUserTicketsCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketsCommandSchema"));
