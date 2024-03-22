import { Schema } from "@effect/schema";

import { IdEventSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetEventByIdCommandPayloadFrom = {
	readonly id: string;
};

export const GetEventByIdCommandPayloadSchema = Schema.struct({
	id: IdEventSchema,
}).pipe(
	_SS.satisfies.from.json<GetEventByIdCommandPayloadFrom>(),
	Schema.identifier("GetEventByIdCommandPayloadSchema")
);

export const GetEventByIdCommandSchema = BaseCausedCommandFor(
	GetEventByIdCommandPayloadSchema
).pipe(Schema.identifier("GetEventByIdCommandSchema"));
