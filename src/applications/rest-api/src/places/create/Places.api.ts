import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreatePlaceCommandPayload } from "@argazi/application";
import { IdGeoPoint } from "@argazi/domain";
import { IdPlace } from "@argazi/domain";
import { type PlaceBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseResponseFor } from "../../BaseResponseFor.js";

// #region CreatePlaceRequestBody
const _CreatePlaceRequestBody = CreatePlaceCommandPayload.pipe(
  Schema.identifier("CreatePlaceRequestBody")
);

export type CreatePlaceRequestBodyContext = Schema.Schema.Context<
  typeof _CreatePlaceRequestBody
>;
export interface CreatePlaceRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreatePlaceRequestBody> {}
export interface CreatePlaceRequestBody
  extends Schema.Schema.Type<typeof _CreatePlaceRequestBody> {}

export const CreatePlaceRequestBody: Schema.Schema<
  CreatePlaceRequestBody,
  CreatePlaceRequestBodyEncoded
> = _CreatePlaceRequestBody;
// #endregion CreatePlaceRequestBody

// #region Schema for CreatePlaceResponse
const _CreatePlaceResponse = Schema.Struct({
  id: IdPlace,
  idGeoPoint: IdGeoPoint,
  name: Schema.compose(Schema.Trim, Schema.NonEmpty),
  description: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.type<PlaceBase>(),
  _SS.satisfies.encoded.json(),
  Schema.identifier("CreatePlaceResponse"),
  BaseResponseFor
);

export type CreatePlaceResponseContext = Schema.Schema.Context<
  typeof _CreatePlaceResponse
>;
export interface CreatePlaceResponseEncoded
  extends Schema.Schema.Encoded<typeof _CreatePlaceResponse> {}
export interface CreatePlaceResponse
  extends Schema.Schema.Type<typeof _CreatePlaceResponse> {}

export const CreatePlaceResponse: Schema.Schema<
  CreatePlaceResponse,
  CreatePlaceResponseEncoded
> = _CreatePlaceResponse;
// #endregion Schema for  CreatePlaceResponse

export const CreatePlaceEndpoint = ApiEndpoint.post(
  "createPlace",
  "/places",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreatePlaceRequestBody),
  ApiEndpoint.setResponseBody(CreatePlaceResponse)
);
