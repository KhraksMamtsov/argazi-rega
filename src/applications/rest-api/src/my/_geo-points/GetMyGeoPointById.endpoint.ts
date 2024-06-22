import * as Schema from "@effect/schema/Schema";
// import { ApiEndpoint } from "effect-http";

import { IdGeoPoint } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
// import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { GeoPointApi } from "../../geo-points/GeoPoint.api.js";

export const GetMyGeoPointByIdApi = GeoPointApi.pipe(
  Schema.annotations({ identifier: "GetMyGeoPointByIdApi" }),
  BaseResponseFor
);

export const GetMyGeoPointByIdRequest = {
  params: Schema.Struct({
    idGeoPoint: IdGeoPoint,
  }),
};

export const GetMyGeoPointByIdResponse = GetMyGeoPointByIdApi.pipe(
  Schema.annotations({ description: "GetMyGeoPointByIdResponse" })
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
