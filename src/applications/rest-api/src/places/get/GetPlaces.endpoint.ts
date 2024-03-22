import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { PlaceApi } from "../Place.api.js";

export const _GetPlacesResponseSchema = PlaceApi.pipe(
  Schema.identifier("GetPlacesResponseSchema"),
  BaseResponseManyFor
);
export interface GetPlacesResponseFrom
  extends Schema.Schema.Encoded<typeof _GetPlacesResponseSchema> {}
export interface GetPlacesResponse
  extends Schema.Schema.Type<typeof _GetPlacesResponseSchema> {}

export const GetPlacesResponseSchema: Schema.Schema<
  GetPlacesResponse,
  GetPlacesResponseFrom
> = _GetPlacesResponseSchema;

export const GetPlacesResponse = GetPlacesResponseSchema.pipe(
  Schema.description("Place")
);

export const GetPlacesEndpoint = ApiEndpoint.get(
  "getPlaces",
  "/places",
  {}
).pipe(
  ApiEndpoint.setResponseBody(GetPlacesResponse),
  ApiEndpoint.setSecurity(BearerAuth)
);
