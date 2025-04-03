import { Schema } from "effect";

import { IdSubscription } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";
import { HttpApiEndpoint } from "@effect/platform";

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

export const DeleteMySubscriptionEndpoint = HttpApiEndpoint.del(
  "deleteMySubscription",
  "/my/subscriptions/:idSubscription"
)
  .setPath(DeleteMySubscriptionRequestParams)
  .addSuccess(DeleteMySubscriptionResponseBody);
