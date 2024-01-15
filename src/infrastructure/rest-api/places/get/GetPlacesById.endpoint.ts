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
		id: IdPlaceSchema,
	}),
};

export const GetPlaceByIdResponse = GetPlaceByIdResponseSchema.pipe(
	Schema.description("Place")
);

export const GetPlaceByIdEndpoint = Api.get("getPlaceById", "/places/:id", {
	request: GetPlaceByIdRequest,
	response: GetPlaceByIdResponse,
});
