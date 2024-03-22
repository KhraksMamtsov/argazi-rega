import * as Schema from "@effect/schema/Schema";

import { IdGeoPointSchema } from "@argazi/domain";
import { IdPlaceSchema } from "@argazi/domain";
import type { PlaceBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _PlaceApi = Schema.struct({
  id: IdPlaceSchema,
  idGeoPoint: IdGeoPointSchema,
  name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.from.json(),
  _SS.satisfies.to<PlaceBase>(),
  Schema.identifier("PlaceApi")
);

export interface PlaceApiFrom extends Schema.Schema.Encoded<typeof _PlaceApi> {}
export interface PlaceApi extends Schema.Schema.Type<typeof _PlaceApi> {}

export const PlaceApi: Schema.Schema<PlaceApi, PlaceApiFrom> = _PlaceApi;
