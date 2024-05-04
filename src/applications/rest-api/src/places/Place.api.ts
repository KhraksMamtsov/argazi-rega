import * as Schema from "@effect/schema/Schema";

import { IdGeoPoint } from "@argazi/domain";
import { IdPlace } from "@argazi/domain";
import type { PlaceBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _PlaceApi = Schema.Struct({
  id: IdPlace,
  idGeoPoint: IdGeoPoint,
  name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
  description: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<PlaceBase>(),
  Schema.identifier("PlaceApi")
);

export interface PlaceApiFrom extends Schema.Schema.Encoded<typeof _PlaceApi> {}
export interface PlaceApi extends Schema.Schema.Type<typeof _PlaceApi> {}

export const PlaceApi: Schema.Schema<PlaceApi, PlaceApiFrom> = _PlaceApi;
