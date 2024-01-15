import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdSubscriptionSchema } from "../../../../domain/subscription/entity/IdSubscription.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const DeleteMySubscriptionResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("DeleteMySubscriptionResponseSchema"),
	BaseResponseFor
);

export const DeleteMySubscriptionRequest = {
	params: Schema.struct({
		idSubscription: IdSubscriptionSchema,
	}),
};

export const DeleteMySubscriptionResponse =
	DeleteMySubscriptionResponseSchema.pipe(Schema.description("MySubscription"));

export const DeleteMySubscriptionEndpoint = Api.delete(
	"deleteMySubscription",
	"/my/subscriptions/:idSubscription",
	{
		request: DeleteMySubscriptionRequest,
		response: DeleteMySubscriptionResponse,
	},
	{
		security: BearerAuth,
		summary: "Unsubscribe user from events of some place",
	}
);
