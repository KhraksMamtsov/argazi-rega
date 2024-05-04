import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlace } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { PlaceApi } from "../Place.api.js";

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
  Schema.identifier("GetPlaceByIdResponse"),
  BaseResponseFor
).pipe(Schema.description("Place"));

export interface GetPlaceByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceByIdResponseBody> {}
export interface GetPlaceByIdResponseBody
  extends Schema.Schema.Type<typeof _GetPlaceByIdResponseBody> {}

export const GetPlaceByIdResponseBody: Schema.Schema<
  GetPlaceByIdResponseBody,
  GetPlaceByIdResponseBodyEncoded
> = _GetPlaceByIdResponseBody;

export const GetPlaceByIdEndpoint = ApiEndpoint.get(
  "getPlaceById",
  "/places/:idPlace"
).pipe(
  ApiEndpoint.setRequestPath(GetPlaceByIdRequest),
  ApiEndpoint.setResponseBody(GetPlaceByIdResponseBody)
);
