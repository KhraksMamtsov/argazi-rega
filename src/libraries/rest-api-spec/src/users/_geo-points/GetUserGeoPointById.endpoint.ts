import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdGeoPoint } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApi } from "../../geo-points/GeoPoint.api.js";
import { Description } from "@effect/platform/OpenApi";

// #region GetUserGeoPointByIdResponseBody
const _GetUserGeoPointByIdResponseBody = GeoPointApi.pipe(
  Schema.annotations({ identifier: "GetUserGeoPointByIdResponseBody" }),
  BaseResponseFor
);

export type GetUserGeoPointByIdResponseBodyContext = Schema.Schema.Context<
  typeof _GetUserGeoPointByIdResponseBody
>;
export interface GetUserGeoPointByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetUserGeoPointByIdResponseBody> {}
export interface GetUserGeoPointByIdResponseBody
  extends Schema.Schema.Type<typeof _GetUserGeoPointByIdResponseBody> {}

export const GetUserGeoPointByIdResponseBody: Schema.Schema<
  GetUserGeoPointByIdResponseBody,
  GetUserGeoPointByIdResponseBodyEncoded
> = _GetUserGeoPointByIdResponseBody;
// #endregion GetUserGeoPointByIdResponseBody

// #region GetUserGeoPointByIdRequestParams
const _GetUserGeoPointByIdRequestParams = Schema.Struct({
  idGeoPoint: IdGeoPoint,
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "GetUserGeoPointByIdRequestParams" }));

export type GetUserGeoPointByIdRequestParamsContext = Schema.Schema.Context<
  typeof _GetUserGeoPointByIdRequestParams
>;
export interface GetUserGeoPointByIdRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetUserGeoPointByIdRequestParams> {}
export interface GetUserGeoPointByIdRequestParams
  extends Schema.Schema.Type<typeof _GetUserGeoPointByIdRequestParams> {}

export const GetUserGeoPointByIdRequestParams: Schema.Schema<
  GetUserGeoPointByIdRequestParams,
  GetUserGeoPointByIdRequestParamsEncoded
> = _GetUserGeoPointByIdRequestParams;
// #endregion GetUserGeoPointByIdRequestParams

export const GetUserGeoPointByIdEndpoint = HttpApiEndpoint.get(
  "getUserGeoPointById",
  "/users/:idUser/geo-points/:idGeoPoint"
)
  .annotate(Description, "Get user's geo-point")
  .setPath(GetUserGeoPointByIdRequestParams)
  .addSuccess(GetUserGeoPointByIdResponseBody);
