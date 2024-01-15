import * as Schema from "@effect/schema/Schema";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const GetPlaceSubscriptionsResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetPlaceSubscriptionsResponseSchema"),
	BaseResponseManyFor
);

export const GetPlaceSubscriptionsRequest = {
	params: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
};

export const GetPlaceSubscriptionsResponse = [
	{
		content: GetPlaceSubscriptionsResponseSchema.pipe(
			Schema.description("PlaceSubscriptions")
		),
		status: 200,
	},
	{
		content: Schema.string.pipe(
			Schema.description("PlaceSubscriptions not found")
		),
		status: 404,
	},
] as const;
