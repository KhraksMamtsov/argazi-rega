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
  latitude: Schema.compose(Schema.Redacted(Schema.String), Latitude),
  longitude: Schema.compose(Schema.Redacted(Schema.String), Longitude),
  //
  name: Schema.OptionFromNullOr(
    Schema.compose(
      Schema.compose(Schema.Trim, Schema.NonEmpty),
      Schema.Redacted(Schema.String)
    )
  ),
}).pipe(
  _SS.satisfies.type<GeoPointBase>(),
  Schema.annotations({ identifier: "GeoPointApi" })
);

export interface GeoPointApiEncoded
  extends Schema.Schema.Encoded<typeof _GeoPointApi> {}
export interface GeoPointApi extends Schema.Schema.Type<typeof _GeoPointApi> {}

export const GeoPointApi: Schema.Schema<GeoPointApi, GeoPointApiEncoded> =
  _GeoPointApi;
