import { Schema } from "@effect/schema";

import { IdEventSchema } from "../../../../domain/event/entity/IdEvent.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetEventByIdCommandPayloadFrom = {
	readonly id: string;
};

export const GetEventByIdCommandPayloadSchema = Schema.struct({
	id: IdEventSchema,
}).pipe(
	satisfies.from.json<GetEventByIdCommandPayloadFrom>(),
	Schema.identifier("GetEventByIdCommandPayloadSchema")
);

export const GetEventByIdCommandSchema = BaseCausedCommandFor(
	GetEventByIdCommandPayloadSchema
).pipe(Schema.identifier("GetEventByIdCommandSchema"));
