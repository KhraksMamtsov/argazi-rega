import * as Schema from "@effect/schema/Schema";

import { IdGeoPointSchema } from "../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { PlaceBase } from "../../../domain/place/entity/Place.js";

export const PlaceApi = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(
	satisfies.from.json(),
	satisfies.to<PlaceBase>(),
	Schema.identifier("PlaceApi")
);
