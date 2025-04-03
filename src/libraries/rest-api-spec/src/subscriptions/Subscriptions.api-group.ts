import { GetSubscriptionByIdEndpoint } from "./get/GetSubscriptionById.endpoint.js";
import { HttpApiGroup } from "@effect/platform";

export const SubscriptionsApiGroup = HttpApiGroup.make("Subscriptions").add(
  GetSubscriptionByIdEndpoint
);
