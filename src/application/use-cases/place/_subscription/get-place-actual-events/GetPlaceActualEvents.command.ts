import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "../../../../../domain/place/entity/IdPlace.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceActualEventsCommandPayloadSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetPlaceActualEventsCommandPayloadSchema")
);

export const GetPlaceActualEventsCommandSchema = BaseCausedCommandFor(
	GetPlaceActualEventsCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceActualEventsCommandSchema"));
