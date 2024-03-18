import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdGeoPointSchema } from "../../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApiSchema } from "../../geo-points/GeoPoint.api.js";

// #region GetUserGeoPointByIdResponseBody
const _GetUserGeoPointByIdResponseBodySchema = GeoPointApiSchema.pipe(
	Schema.identifier("GetUserGeoPointByIdResponseBodySchema"),
	BaseResponseFor
);

export type GetUserGeoPointByIdResponseBodyContext = Schema.Schema.Context<
	typeof _GetUserGeoPointByIdResponseBodySchema
>;
export interface GetUserGeoPointByIdResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _GetUserGeoPointByIdResponseBodySchema
	> {}
export interface GetUserGeoPointByIdResponseBody
	extends Schema.Schema.Type<typeof _GetUserGeoPointByIdResponseBodySchema> {}

export const GetUserGeoPointByIdResponseBodySchema: Schema.Schema<
	GetUserGeoPointByIdResponseBody,
	GetUserGeoPointByIdResponseBodyEncoded
> = _GetUserGeoPointByIdResponseBodySchema;
// #endregion GetUserGeoPointByIdResponseBodySchema

// #region GetUserGeoPointByIdRequestParams
const _GetUserGeoPointByIdRequestParamsSchema = Schema.struct({
	idGeoPoint: IdGeoPointSchema,
	idUser: IdUserSchema,
}).pipe(Schema.identifier("GetUserGeoPointByIdRequestParamsSchema"));

export type GetUserGeoPointByIdRequestParamsContext = Schema.Schema.Context<
	typeof _GetUserGeoPointByIdRequestParamsSchema
>;
export interface GetUserGeoPointByIdRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _GetUserGeoPointByIdRequestParamsSchema
	> {}
export interface GetUserGeoPointByIdRequestParams
	extends Schema.Schema.Type<typeof _GetUserGeoPointByIdRequestParamsSchema> {}

export const GetUserGeoPointByIdRequestParamsSchema: Schema.Schema<
	GetUserGeoPointByIdRequestParams,
	GetUserGeoPointByIdRequestParamsEncoded
> = _GetUserGeoPointByIdRequestParamsSchema;
// #endregion GetUserGeoPointByIdRequestParamsSchema

export const GetUserGeoPointByIdEndpoint = ApiEndpoint.get(
	"getUserGeoPointById",
	"/users/:idUser/geo-points/:idGeoPoint",
	{
		summary: "Get user's geo-point",
	}
).pipe(
	ApiEndpoint.setRequestPath(GetUserGeoPointByIdRequestParamsSchema),
	ApiEndpoint.setResponseBody(GetUserGeoPointByIdResponseBodySchema)
);
