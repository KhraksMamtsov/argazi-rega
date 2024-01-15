import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdGeoPointSchema } from "../../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

export const GetUserGeoPointByIdResponseSchema = GeoPointApiSchema.pipe(
	Schema.identifier("GetUserGeoPointByIdResponseSchema"),
	BaseResponseFor
);

export const GetUserGeoPointByIdRequest = {
	params: Schema.struct({
		idGeoPoint: IdGeoPointSchema,
		idUser: IdUserSchema,
	}),
};

export const GetUserGeoPointByIdResponse =
	GetUserGeoPointByIdResponseSchema.pipe(
		Schema.description("UserGeoPointById")
	);

export const GetUserGeoPointByIdEndpoint = Api.get(
	"getUserGeoPointById",
	"/users/:idUser/geo-points/:idGeoPoint",
	{
		request: GetUserGeoPointByIdRequest,
		response: GetUserGeoPointByIdResponse,
	},
	{
		summary: "Get user's geo-point",
	}
);
