import { Api } from "effect-http";

import { GetSubscriptionByIdEndpoint } from "./get/GetSubscriptionById.endpoint.js";

export const SubscriptionsApiGroup = Api.apiGroup("subscriptions").pipe(
	//
	GetSubscriptionByIdEndpoint
);
