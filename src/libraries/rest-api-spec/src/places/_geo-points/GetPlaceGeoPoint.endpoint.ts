import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { GeoPointApi } from "../../geo-points/GeoPoint.api.js";
import { HttpApiEndpoint } from "@effect/platform";

const _GetPlaceGeoPointResponseBody = GeoPointApi.pipe(BaseResponseFor).pipe(
  Schema.annotations({ identifier: "GetPlaceGeoPointResponseBody" })
);

export interface GetPlaceGeoPointResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointResponseBody> {}
export interface GetPlaceGeoPointResponseBody
  extends Schema.Schema.Type<typeof _GetPlaceGeoPointResponseBody> {}

export const GetPlaceGeoPointResponseBody: Schema.Schema<
  GetPlaceGeoPointResponseBody,
  GetPlaceGeoPointResponseBodyEncoded
> = _GetPlaceGeoPointResponseBody;

// #region GetPlaceGeoPointRequestParams
const _GetPlaceGeoPointRequestParams = Schema.Struct({
  idPlace: IdPlace,
}).pipe(Schema.annotations({ identifier: "GetPlaceGeoPointRequestParams" }));

export interface GetPlaceGeoPointRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceGeoPointRequestParams> {}
export interface GetPlaceGeoPointRequestParams
  extends Schema.Schema.Type<typeof _GetPlaceGeoPointRequestParams> {}

export const GetPlaceGeoPointRequestParams: Schema.Schema<
  GetPlaceGeoPointRequestParams,
  GetPlaceGeoPointRequestParamsEncoded
> = _GetPlaceGeoPointRequestParams;
// #endregion GetPlaceGeoPointRequestParams

export const GetPlaceGeoPointEndpoint = HttpApiEndpoint.get(
  "getPlaceGeoPoint",
  "/places/:idPlace/geo-point"
)
  .setPath(GetPlaceGeoPointRequestParams)
  .addSuccess(GetPlaceGeoPointResponseBody);
