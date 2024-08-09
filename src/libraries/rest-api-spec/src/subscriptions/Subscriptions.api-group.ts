import { ApiGroup } from "effect-http";

import { GetSubscriptionByIdEndpoint } from "./get/GetSubscriptionById.endpoint.js";

export const SubscriptionsApiGroup = ApiGroup.make("Subscriptions").pipe(
  ApiGroup.addEndpoint(GetSubscriptionByIdEndpoint)
);
