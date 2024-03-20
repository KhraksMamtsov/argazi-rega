import * as Schema from "@effect/schema/Schema";

import { IdGeoPointSchema } from "../../../libraries/domain/src/geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../../../libraries/domain/src/place/entity/IdPlace.js";
import { _SS } from "@argazi/shared";

import type { PlaceBase } from "../../../libraries/domain/src/place/entity/Place.js";

export const _PlaceApi = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(
	satisfies.from.json(),
	satisfies.to<PlaceBase>(),
	Schema.identifier("PlaceApi")
);

export interface PlaceApiFrom extends Schema.Schema.Encoded<typeof _PlaceApi> {}
export interface PlaceApi extends Schema.Schema.Type<typeof _PlaceApi> {}

export const PlaceApi: Schema.Schema<PlaceApi, PlaceApiFrom> = _PlaceApi;
