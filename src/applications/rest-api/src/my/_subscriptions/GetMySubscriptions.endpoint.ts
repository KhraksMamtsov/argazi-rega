import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";

export const _GetMySubscriptionsResponseBody = SubscriptionApi.pipe(
  Schema.identifier("GetMySubscriptionsResponse"),
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
  Schema.description("UserSubscriptions")
);

export const GetMySubscriptionsEndpoint = ApiEndpoint.get(
  "getMySubscriptions",
  "/my/subscriptions",
  {
    summary: "Get all user's subscriptions",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMySubscriptionsResponse),
  ApiEndpoint.setSecurity(BearerAuth)
);
