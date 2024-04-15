import * as Schema from "@effect/schema/Schema";
// import { ApiEndpoint } from "effect-http";

import { IdGeoPointSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
// import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

export const GetMyGeoPointByIdResponseSchema = GeoPointApiSchema.pipe(
  Schema.identifier("GetMyGeoPointByIdResponseSchema"),
  BaseResponseFor
);

export const GetMyGeoPointByIdRequest = {
  params: Schema.Struct({
    idGeoPoint: IdGeoPointSchema,
  }),
};

export const GetMyGeoPointByIdResponse = GetMyGeoPointByIdResponseSchema.pipe(
  Schema.description("MyGeoPointById")
);

// export const GetMyGeoPointByIdEndpoint = ApiEndpoint.get(
// 	"getMyGeoPointById",
// 	"/my/geo-points/:idGeoPoint",
// 	{
// 		request: GetMyGeoPointByIdRequest,
// 		response: GetMyGeoPointByIdResponse,
// 	},
// 	{
// 		security: BearerAuth,
// 		summary: "Get user's geo-point",
// 	}
// );
