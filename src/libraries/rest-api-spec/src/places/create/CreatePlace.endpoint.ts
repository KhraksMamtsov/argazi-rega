import { Schema } from "effect";

import { CreatePlaceCommandPayload } from "@argazi/application";
import { IdGeoPoint } from "@argazi/domain";
import { IdPlace } from "@argazi/domain";
import { type PlaceBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region CreatePlaceRequestBody
const _CreatePlaceRequestBody = CreatePlaceCommandPayload.pipe(
  Schema.annotations({ identifier: "CreatePlaceRequestBody" })
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
  name: Schema.compose(Schema.Trim, Schema.NonEmptyString),
  description: Schema.OptionFromNonEmptyTrimmedString,
}).pipe(
  _SS.satisfies.type<PlaceBase>(),
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "CreatePlaceResponse" }),
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

export const CreatePlaceEndpoint = HttpApiEndpoint.post(
  "createPlace",
  "/places"
)
  .setPayload(CreatePlaceRequestBody)
  .addSuccess(CreatePlaceResponse);
