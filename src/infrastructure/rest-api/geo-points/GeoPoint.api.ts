import * as Schema from "@effect/schema/Schema";

import { type GeoPointBase } from "../../../domain/geo-point/entity/GeoPoint.js";
import { IdGeoPointSchema } from "../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { LatitudeSchema } from "../../../domain/value-objects/Latitude.js";
import { LongitudeSchema } from "../../../domain/value-objects/Longitude.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

export const _GeoPointApiSchema = Schema.struct({
	id: IdGeoPointSchema,
	idUser: IdUserSchema,
	latitude: Schema.compose(Schema.Secret, LatitudeSchema),
	longitude: Schema.compose(Schema.Secret, LongitudeSchema),
	//
	name: Schema.optionFromNullable(
		Schema.compose(Schema.compose(Schema.Trim, Schema.NonEmpty), Schema.Secret)
	),
}).pipe(satisfies.to<GeoPointBase>(), Schema.identifier("GeoPointApiSchema"));

export interface GeoPointApiEncoded
	extends Schema.Schema.Encoded<typeof _GeoPointApiSchema> {}
export interface GeoPointApi
	extends Schema.Schema.Type<typeof _GeoPointApiSchema> {}

export const GeoPointApiSchema: Schema.Schema<GeoPointApi, GeoPointApiEncoded> =
	_GeoPointApiSchema;
