import * as Schema from "@effect/schema/Schema";

import { type GeoPointBase } from "@argazi/domain";
import { IdGeoPointSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import { LatitudeSchema } from "@argazi/domain";
import { LongitudeSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _GeoPointApiSchema = Schema.Struct({
  id: IdGeoPointSchema,
  idUser: IdUserSchema,
  latitude: Schema.compose(Schema.Secret, LatitudeSchema),
  longitude: Schema.compose(Schema.Secret, LongitudeSchema),
  //
  name: Schema.OptionFromNullOr(
    Schema.compose(Schema.compose(Schema.Trim, Schema.NonEmpty), Schema.Secret)
  ),
}).pipe(
  _SS.satisfies.to<GeoPointBase>(),
  Schema.identifier("GeoPointApiSchema")
);

export interface GeoPointApiEncoded
  extends Schema.Schema.Encoded<typeof _GeoPointApiSchema> {}
export interface GeoPointApi
  extends Schema.Schema.Type<typeof _GeoPointApiSchema> {}

export const GeoPointApiSchema: Schema.Schema<GeoPointApi, GeoPointApiEncoded> =
  _GeoPointApiSchema;
