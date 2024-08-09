import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdSubscription } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";

// #region DeleteMySubscriptionResponseBody
const _DeleteMySubscriptionResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "DeleteMySubscriptionResponseBody" }),
  BaseResponseFor
);

export type DeleteMySubscriptionResponseBodyContext = Schema.Schema.Context<
  typeof _DeleteMySubscriptionResponseBody
>;
export interface DeleteMySubscriptionResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMySubscriptionResponseBody> {}
export interface DeleteMySubscriptionResponseBody
  extends Schema.Schema.Type<typeof _DeleteMySubscriptionResponseBody> {}

export const DeleteMySubscriptionResponseBody: Schema.Schema<
  DeleteMySubscriptionResponseBody,
  DeleteMySubscriptionResponseBodyEncoded
> = _DeleteMySubscriptionResponseBody;
// #endregion DeleteMySubscriptionResponseBody

// #region DeleteMySubscriptionRequestParams
const _DeleteMySubscriptionRequestParams = Schema.Struct({
  idSubscription: IdSubscription,
}).pipe(
  Schema.annotations({ identifier: "DeleteMySubscriptionRequestParams" })
);

export type DeleteMySubscriptionRequestParamsContext = Schema.Schema.Context<
  typeof _DeleteMySubscriptionRequestParams
>;
export interface DeleteMySubscriptionRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMySubscriptionRequestParams> {}
export interface DeleteMySubscriptionRequestParams
  extends Schema.Schema.Type<typeof _DeleteMySubscriptionRequestParams> {}

export const DeleteMySubscriptionRequestParams: Schema.Schema<
  DeleteMySubscriptionRequestParams,
  DeleteMySubscriptionRequestParamsEncoded
> = _DeleteMySubscriptionRequestParams;
// #endregion DeleteMySubscriptionRequestParams

export const DeleteMySubscriptionEndpoint = ApiEndpoint.delete(
  "deleteMySubscription",
  "/my/subscriptions/:idSubscription",
  {
    summary: "Unsubscribe user from events of some place",
  }
).pipe(
  ApiEndpoint.setRequestPath(DeleteMySubscriptionRequestParams),
  ApiEndpoint.setResponseBody(DeleteMySubscriptionResponseBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
