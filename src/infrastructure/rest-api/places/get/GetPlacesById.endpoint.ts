import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { PlaceApi } from "../Place.api.js";

export const GetPlaceByIdResponseSchema = PlaceApi.pipe(
	Schema.identifier("GetPlaceByIdResponseSchema"),
	BaseResponseFor
);

export const GetPlaceByIdRequest = {
	params: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
};

export const GetPlaceByIdResponse = GetPlaceByIdResponseSchema.pipe(
	Schema.description("Place")
);

export const GetPlaceByIdEndpoint = ApiEndpoint.get(
	"getPlaceById",
	"/places/:idPlace",
	{
		request: GetPlaceByIdRequest,
		response: GetPlaceByIdResponse,
	}
);
