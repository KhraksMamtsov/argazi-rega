import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { PlaceApi } from "../Place.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const _GetPlaceByIdRequest = Schema.Struct({
  idPlace: IdPlace,
});

export interface GetPlaceByIdRequestEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceByIdRequest> {}
export interface GetPlaceByIdRequest
  extends Schema.Schema.Type<typeof _GetPlaceByIdRequest> {}

export const GetPlaceByIdRequest: Schema.Schema<
  GetPlaceByIdRequest,
  GetPlaceByIdRequestEncoded
> = _GetPlaceByIdRequest;

export const _GetPlaceByIdResponseBody = PlaceApi.pipe(
  Schema.annotations({ identifier: "GetPlaceByIdResponse" }),
  BaseResponseFor
).pipe(Schema.annotations({ description: "Place" }));

export interface GetPlaceByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceByIdResponseBody> {}
export interface GetPlaceByIdResponseBody
  extends Schema.Schema.Type<typeof _GetPlaceByIdResponseBody> {}

export const GetPlaceByIdResponseBody: Schema.Schema<
  GetPlaceByIdResponseBody,
  GetPlaceByIdResponseBodyEncoded
> = _GetPlaceByIdResponseBody;

export const GetPlaceByIdEndpoint = HttpApiEndpoint.get(
  "getPlaceById",
  "/places/:idPlace"
)
  .setPath(GetPlaceByIdRequest)
  .addSuccess(GetPlaceByIdResponseBody);
