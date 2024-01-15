import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { IdSubscriptionSchema } from "../../../../domain/subscription/entity/IdSubscription.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const DeleteUserSubscriptionResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("DeleteUserSubscriptionResponseSchema"),
	BaseResponseFor
);

export const DeleteUserSubscriptionRequest = {
	params: Schema.struct({
		idSubscription: IdSubscriptionSchema,
		idUser: IdUserSchema,
	}),
};

export const DeleteUserSubscriptionResponse =
	DeleteUserSubscriptionResponseSchema.pipe(
		Schema.description("UserSubscription")
	);

export const DeleteUserSubscriptionEndpoint = Api.delete(
	"deleteUserSubscription",
	"/users/:idUser/subscriptions/:idSubscription",
	{
		request: DeleteUserSubscriptionRequest,
		response: DeleteUserSubscriptionResponse,
	},
	{
		summary: "Unsubscribe user from events of some place",
	}
);
