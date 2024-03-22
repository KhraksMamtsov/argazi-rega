import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdPlaceSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

const _GetPlaceGeoPointResponseBodySchema = GeoPointApiSchema.pipe(
	BaseResponseFor
).pipe(Schema.identifier("GetPlaceGeoPointResponseBodySchema"));

export interface GetPlaceGeoPointResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointResponseBodySchema> {}
export interface GetPlaceGeoPointResponseBody
	extends Schema.Schema.Type<typeof _GetPlaceGeoPointResponseBodySchema> {}

export const GetPlaceGeoPointResponseBodySchema: Schema.Schema<
	GetPlaceGeoPointResponseBody,
	GetPlaceGeoPointResponseBodyEncoded
> = _GetPlaceGeoPointResponseBodySchema;

// #region GetPlaceGeoPointRequestParamsSchema
const _GetPlaceGeoPointRequestParamsSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("GetPlaceGeoPointRequestParamsSchema"));

export interface GetPlaceGeoPointRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointRequestParamsSchema> {}
export interface GetPlaceGeoPointRequestParams
	extends Schema.Schema.Type<typeof _GetPlaceGeoPointRequestParamsSchema> {}

export const GetPlaceGeoPointRequestParamsSchema: Schema.Schema<
	GetPlaceGeoPointRequestParams,
	GetPlaceGeoPointRequestParamsEncoded
> = _GetPlaceGeoPointRequestParamsSchema;
// #endregion GetPlaceGeoPointRequestParamsSchema

export const GetPlaceGeoPoint = ApiEndpoint.get(
	"getPlaceGeoPoint",
	"/places/:idPlace/geo-point",
	{}
).pipe(
	ApiEndpoint.setRequestPath(GetPlaceGeoPointRequestParamsSchema),
	ApiEndpoint.setResponse(
		ApiResponse.make(200, GetPlaceGeoPointResponseBodySchema)
	),
	ApiEndpoint.addResponse(ApiResponse.make(404))
);
