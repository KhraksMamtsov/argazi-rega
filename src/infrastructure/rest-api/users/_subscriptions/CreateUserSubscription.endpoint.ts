import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const CreateUserSubscriptionResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("CreateUserSubscriptionResponseSchema"),
	BaseResponseFor
);

export const CreateUserSubscriptionRequest = {
	body: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
	params: Schema.struct({
		idUser: IdUserSchema,
	}),
};

export const CreateUserSubscriptionResponse =
	CreateUserSubscriptionResponseSchema.pipe(
		Schema.description("UserSubscriptions")
	);

export const CreateUserSubscriptionEndpoint = ApiEndpoint.post(
	"createUserSubscription",
	"/users/:idUser/subscriptions",
	{
		request: CreateUserSubscriptionRequest,
		response: CreateUserSubscriptionResponse,
	},
	{
		summary: "Subscribe user on events of some place",
	}
);
