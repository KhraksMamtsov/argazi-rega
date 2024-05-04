import * as Schema from "@effect/schema/Schema";

import { type GeoPointBase } from "@argazi/domain";
import { IdGeoPoint } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import { Latitude } from "@argazi/domain";
import { Longitude } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _GeoPointApi = Schema.Struct({
  id: IdGeoPoint,
  idUser: IdUser,
  latitude: Schema.compose(Schema.Secret, Latitude),
  longitude: Schema.compose(Schema.Secret, Longitude),
  //
  name: Schema.OptionFromNullOr(
    Schema.compose(Schema.compose(Schema.Trim, Schema.NonEmpty), Schema.Secret)
  ),
}).pipe(_SS.satisfies.type<GeoPointBase>(), Schema.identifier("GeoPointApi"));

export interface GeoPointApiEncoded
  extends Schema.Schema.Encoded<typeof _GeoPointApi> {}
export interface GeoPointApi extends Schema.Schema.Type<typeof _GeoPointApi> {}

export const GeoPointApi: Schema.Schema<GeoPointApi, GeoPointApiEncoded> =
  _GeoPointApi;
