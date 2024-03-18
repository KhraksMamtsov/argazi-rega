import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

const _GetPlaceGeoPointResponseBodySchema = GeoPointApiSchema.pipe(
	BaseResponseFor
).pipe(Schema.identifier("GetPlaceGeoPointResponseBodySchema"));

interface GetPlaceGeoPointResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointResponseBodySchema> {}
interface GetPlaceGeoPointResponseBody
	extends Schema.Schema.Type<typeof _GetPlaceGeoPointResponseBodySchema> {}

export const GetPlaceGeoPointResponseBodySchema: Schema.Schema<
	GetPlaceGeoPointResponseBody,
	GetPlaceGeoPointResponseBodyEncoded
> = _GetPlaceGeoPointResponseBodySchema;

// #region GetPlaceGeoPointRequestParamsSchema
const _GetPlaceGeoPointRequestParamsSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("GetPlaceGeoPointRequestParamsSchema"));

interface GetPlaceGeoPointRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointRequestParamsSchema> {}
interface GetPlaceGeoPointRequestParams
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
	ApiEndpoint.setResponseBody(GetPlaceGeoPointResponseBodySchema)
);
