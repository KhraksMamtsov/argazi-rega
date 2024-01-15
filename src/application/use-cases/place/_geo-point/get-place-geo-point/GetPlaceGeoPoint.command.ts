import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "../../../../../domain/place/entity/IdPlace.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceGeoPointCommandPayloadSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetPlaceGeoPointCommandPayloadSchema")
);

export const GetPlaceGeoPointCommandSchema = BaseCausedCommandFor(
	GetPlaceGeoPointCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceGeoPointCommandSchema"));
