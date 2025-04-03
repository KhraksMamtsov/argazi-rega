import { Schema } from "effect";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { PlaceApi } from "../Place.api.js";
import { HttpApiEndpoint } from "@effect/platform";

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

export const GetPlacesEndpoint = HttpApiEndpoint.get(
  "getPlaces",
  "/places"
).addSuccess(GetPlacesResponseBody);
