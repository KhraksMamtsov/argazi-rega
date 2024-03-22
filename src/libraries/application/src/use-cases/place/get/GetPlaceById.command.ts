import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetPlaceByIdCommandPayloadFrom = {
	readonly id: string;
};

export const GetPlaceByIdCommandPayloadSchema = Schema.struct({
	id: IdPlaceSchema,
}).pipe(
	_SS.satisfies.from.json<GetPlaceByIdCommandPayloadFrom>(),
	Schema.identifier("GetPlaceByIdCommandPayloadSchema")
);

export const GetPlaceByIdCommandSchema = BaseCausedCommandFor(
	GetPlaceByIdCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceByIdCommandSchema"));
