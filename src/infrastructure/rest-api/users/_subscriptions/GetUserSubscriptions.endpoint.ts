import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const GetUserSubscriptionsResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetUserSubscriptionsResponseSchema"),
	BaseResponseManyFor
);

export const GetUserSubscriptionsRequest = {
	params: Schema.struct({
		idUser: IdUserSchema,
	}),
};

export const GetUserSubscriptionsResponse =
	GetUserSubscriptionsResponseSchema.pipe(
		Schema.description("UserSubscriptions")
	);

export const GetUserSubscriptionsEndpoint = Api.get(
	"getUserSubscriptions",
	"/users/:idUser/subscriptions",
	{
		request: GetUserSubscriptionsRequest,
		response: GetUserSubscriptionsResponse,
	},
	{
		summary: "Get all user's subscriptions",
	}
);
