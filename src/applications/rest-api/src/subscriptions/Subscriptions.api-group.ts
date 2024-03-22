import { ApiGroup } from "effect-http";

import { GetSubscriptionByIdEndpoint } from "./get/GetSubscriptionById.endpoint.js";

export const SubscriptionsApiGroup = ApiGroup.make("subscriptions").pipe(
  ApiGroup.addEndpoint(GetSubscriptionByIdEndpoint)
);
