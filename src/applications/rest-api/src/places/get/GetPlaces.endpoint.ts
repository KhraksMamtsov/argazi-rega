import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { PlaceApi } from "../Place.api.js";

export const _GetPlacesResponseBody = PlaceApi.pipe(
  Schema.annotations({ identifier: "GetPlacesResponse" }),
  BaseResponseManyFor
);
export interface GetPlacesResponseBodyFrom
  extends Schema.Schema.Encoded<typeof _GetPlacesResponseBody> {}
export interface GetPlacesResponseBody
  extends Schema.Schema.Type<typeof _GetPlacesResponseBody> {}

export const GetPlacesResponseBody: Schema.Schema<
  GetPlacesResponseBody,
  GetPlacesResponseBodyFrom
> = _GetPlacesResponseBody.pipe(Schema.annotations({ description: "Place" }));

export const GetPlacesEndpoint = ApiEndpoint.get(
  "getPlaces",
  "/places",
  {}
).pipe(
  ApiEndpoint.setResponseBody(GetPlacesResponseBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
