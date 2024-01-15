import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const CreateMySubscriptionResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("CreateMySubscriptionResponseSchema"),
	BaseResponseFor
);

export const CreateMySubscriptionRequest = {
	body: Schema.struct({
		idPlace: IdPlaceSchema,
	}),
};

export const CreateMySubscriptionResponse =
	CreateMySubscriptionResponseSchema.pipe(
		Schema.description("UserSubscriptions")
	);

export const CreateMySubscriptionEndpoint = Api.post(
	"createMySubscription",
	"/my/subscriptions",
	{
		request: CreateMySubscriptionRequest,
		response: CreateMySubscriptionResponse,
	},
	{
		security: BearerAuth,
		summary: "Subscribe user on events of some place",
	}
);
