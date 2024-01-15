import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetPlaceByIdCommandPayloadFrom = {
	readonly id: string;
};

export const GetPlaceByIdCommandPayloadSchema = Schema.struct({
	id: IdPlaceSchema,
}).pipe(
	satisfies.from.json<GetPlaceByIdCommandPayloadFrom>(),
	Schema.identifier("GetPlaceByIdCommandPayloadSchema")
);

export const GetPlaceByIdCommandSchema = BaseCausedCommandFor(
	GetPlaceByIdCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceByIdCommandSchema"));
