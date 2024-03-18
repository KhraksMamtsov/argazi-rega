import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdSubscriptionSchema } from "../../../../domain/subscription/entity/IdSubscription.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../Subscription.api.js";

export const GetSubscriptionByIdResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetSubscriptionByIdResponseSchema"),
	BaseResponseFor
);

export const GetSubscriptionByIdRequest = {
	params: Schema.struct({
		idSubscription: IdSubscriptionSchema,
	}),
};

export const GetSubscriptionByIdResponse = [
	{
		content: GetSubscriptionByIdResponseSchema.pipe(
			Schema.description("Subscription")
		),
		status: 200,
	},
	{
		content: Schema.string.pipe(Schema.description("Subscription not found")),
		status: 404,
	},
] as const;

export const GetSubscriptionByIdEndpoint = ApiEndpoint.get(
	"getSubscription",
	"/subscriptions/:idSubscription",
	{
		request: GetSubscriptionByIdRequest,
		response: GetSubscriptionByIdResponse,
	}
);
