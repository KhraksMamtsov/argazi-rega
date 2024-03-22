import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreatePlaceCommandPayloadSchema } from "@argazi/application";
import { IdGeoPointSchema } from "@argazi/domain";
import { IdPlaceSchema } from "@argazi/domain";
import { type PlaceBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseResponseFor } from "../../BaseResponseFor.js";

// #region CreatePlaceRequestBody
const _CreatePlaceRequestBodySchema = CreatePlaceCommandPayloadSchema.pipe(
  Schema.identifier("CreatePlaceRequestBodySchema")
);

export type CreatePlaceRequestBodyContext = Schema.Schema.Context<
  typeof _CreatePlaceRequestBodySchema
>;
export interface CreatePlaceRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreatePlaceRequestBodySchema> {}
export interface CreatePlaceRequestBody
  extends Schema.Schema.Type<typeof _CreatePlaceRequestBodySchema> {}

export const CreatePlaceRequestBodySchema: Schema.Schema<
  CreatePlaceRequestBody,
  CreatePlaceRequestBodyEncoded
> = _CreatePlaceRequestBodySchema;
// #endregion CreatePlaceRequestBodySchema

// #region Schema for CreatePlaceResponse
const _CreatePlaceResponseSchema = Schema.struct({
  id: IdPlaceSchema,
  idGeoPoint: IdGeoPointSchema,
  name: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.to<PlaceBase>(),
  _SS.satisfies.from.json(),
  Schema.identifier("CreatePlaceResponseSchema"),
  BaseResponseFor
);

export type CreatePlaceResponseContext = Schema.Schema.Context<
  typeof _CreatePlaceResponseSchema
>;
export interface CreatePlaceResponseEncoded
  extends Schema.Schema.Encoded<typeof _CreatePlaceResponseSchema> {}
export interface CreatePlaceResponse
  extends Schema.Schema.Type<typeof _CreatePlaceResponseSchema> {}

export const CreatePlaceResponseSchema: Schema.Schema<
  CreatePlaceResponse,
  CreatePlaceResponseEncoded
> = _CreatePlaceResponseSchema;
// #endregion Schema for  CreatePlaceResponseSchema

export const CreatePlaceEndpoint = ApiEndpoint.post(
  "createPlace",
  "/places",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreatePlaceRequestBodySchema),
  ApiEndpoint.setResponseBody(CreatePlaceResponseSchema)
);
