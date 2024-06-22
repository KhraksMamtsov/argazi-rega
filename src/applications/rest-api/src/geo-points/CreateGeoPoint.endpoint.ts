import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { CreateGeoPointCommandPayload } from "@argazi/application";

import { GeoPointApi } from "./GeoPoint.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { BearerAuth } from "../BearerAuth.security-scheme.js";

export const _CreateGeoPointRequestBody = CreateGeoPointCommandPayload.pipe(
  Schema.annotations({ identifier: "CreateGeoPointRequestBody" })
);

export interface CreateGeoPointRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateGeoPointRequestBody> {}

export interface CreateGeoPointRequestBody
  extends Schema.Schema.Type<typeof _CreateGeoPointRequestBody> {}

export const CreateGeoPointRequestBody: Schema.Schema<
  CreateGeoPointRequestBody,
  CreateGeoPointRequestBodyEncoded
> = _CreateGeoPointRequestBody;

const _CreateGeoPointResponseBody = GeoPointApi.pipe(
  Schema.annotations({ identifier: "CreateGeoPointResponseBody" }),
  BaseResponseFor
);

export interface CreateGeoPointResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateGeoPointResponseBody> {}

export interface CreateGeoPointResponseBody
  extends Schema.Schema.Type<typeof _CreateGeoPointResponseBody> {}

export const CreateGeoPointResponse: Schema.Schema<
  CreateGeoPointResponseBody,
  CreateGeoPointResponseBodyEncoded
> = _CreateGeoPointResponseBody;

export const CreateGeoPointEndpoint = ApiEndpoint.post(
  "createGeoPoint",
  "/geo-points"
).pipe(
  ApiEndpoint.setRequestBody(CreateGeoPointRequestBody),
  ApiEndpoint.setResponse(ApiResponse.make(200, CreateGeoPointResponse)),
  ApiEndpoint.addResponse(ApiResponse.make(401)),
  ApiEndpoint.setSecurity(BearerAuth)
);
