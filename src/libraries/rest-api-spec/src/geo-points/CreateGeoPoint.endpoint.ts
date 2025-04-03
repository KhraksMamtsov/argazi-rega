import { Schema } from "effect";

import { CreateGeoPointCommandPayload } from "@argazi/application";

import { GeoPointApi } from "./GeoPoint.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { HttpApiEndpoint } from "@effect/platform";
import { Empty } from "@effect/platform/HttpApiSchema";
import { Summary } from "@effect/platform/OpenApi";

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

export const CreateGeoPointEndpoint = HttpApiEndpoint.post(
  "createGeoPoint",
  "/geo-points"
)
  .annotate(Summary, "Create geo-point")
  .setPayload(CreateGeoPointRequestBody)
  .addSuccess(CreateGeoPointResponse)
  .addError(Empty(401));
