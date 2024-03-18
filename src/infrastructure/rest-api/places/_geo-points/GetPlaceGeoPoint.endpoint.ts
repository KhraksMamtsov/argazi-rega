import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

export const GetPlaceGeoPointResponseSchema = GeoPointApiSchema.pipe(
	Schema.identifier("GetPlaceGeoPointResponseSchema"),
	BaseResponseFor
);

export const GetPlaceGeoPointRequest = {
	params: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
};

export const GetPlaceGeoPointResponse = GetPlaceGeoPointResponseSchema.pipe(
	Schema.description("PlaceGeoPoint")
);

export const GetPlaceGeoPoint = ApiEndpoint.get(
	"getPlaceGeoPoint",
	"/places/:idPlace/geo-point",
	{
		request: GetPlaceGeoPointRequest,
		response: GetPlaceGeoPointResponse,
	}
);
