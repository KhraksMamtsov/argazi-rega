import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { PlaceApi } from "../Place.api.js";

export const _GetPlacesResponseSchema = PlaceApi.pipe(
	Schema.identifier("GetPlacesResponseSchema"),
	BaseResponseManyFor
);
export interface GetPlacesResponseFrom
	extends Schema.Schema.From<typeof _GetPlacesResponseSchema> {}
export interface GetPlacesResponse
	extends Schema.Schema.To<typeof _GetPlacesResponseSchema> {}

export const GetPlacesResponseSchema: Schema.Schema<
	GetPlacesResponse,
	GetPlacesResponseFrom
> = _GetPlacesResponseSchema;

export const GetPlacesResponse = GetPlacesResponseSchema.pipe(
	Schema.description("Place")
);

export const GetPlacesEndpoint = Api.get(
	"getPlaces",
	"/places",
	{
		response: GetPlacesResponse,
	},
	{
		security: BearerAuth,
	}
);
