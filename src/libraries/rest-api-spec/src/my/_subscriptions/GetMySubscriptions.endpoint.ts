import { Schema } from "effect";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const _GetMySubscriptionsResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "GetMySubscriptionsResponse" }),
  BaseResponseManyFor
);

export interface GetMySubscriptionsResponseFrom
  extends Schema.Schema.Encoded<typeof _GetMySubscriptionsResponseBody> {}
export interface GetMySubscriptionsResponse
  extends Schema.Schema.Type<typeof _GetMySubscriptionsResponseBody> {}

export const GetMySubscriptionsResponse: Schema.Schema<
  GetMySubscriptionsResponse,
  GetMySubscriptionsResponseFrom
> = _GetMySubscriptionsResponseBody.pipe(
  Schema.annotations({ description: "UserSubscriptions" })
);

export const GetMySubscriptionsEndpoint = HttpApiEndpoint.get(
  "getMySubscriptions",
  "/my/subscriptions"
).addSuccess(GetMySubscriptionsResponse);
