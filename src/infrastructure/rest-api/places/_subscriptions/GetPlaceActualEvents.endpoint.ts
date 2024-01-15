import * as Schema from "@effect/schema/Schema";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { EventApi } from "../../events/Event.api.js";

export const GetPlaceActualEventsResponseSchema = EventApi.pipe(
	Schema.identifier("GetPlaceActualEventsResponseSchema"),
	BaseResponseManyFor
);

export const GetPlaceActualEventsRequest = {
	params: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
};

export const GetPlaceActualEventsResponse =
	GetPlaceActualEventsResponseSchema.pipe(
		Schema.description("PlaceActualEvents")
	);
