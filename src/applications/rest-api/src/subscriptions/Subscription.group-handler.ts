import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { GetSubscriptionByIdHandlerLive } from "./get/GetSubscriptionById.handler.js";

export const SubscriptionGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Subscriptions",
  (handlers) =>
    handlers.handle("getSubscription", GetSubscriptionByIdHandlerLive)
);
