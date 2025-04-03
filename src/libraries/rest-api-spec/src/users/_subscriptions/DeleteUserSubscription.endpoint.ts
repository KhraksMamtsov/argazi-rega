import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdSubscription } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";
import { Description } from "@effect/platform/OpenApi";

// #region DeleteUserSubscriptionResponseBody
const _DeleteUserSubscriptionResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "_DeleteUserSubscriptionResponseBody" }),
  BaseResponseFor
);

export type DeleteUserSubscriptionResponseBodyContext = Schema.Schema.Context<
  typeof _DeleteUserSubscriptionResponseBody
>;
export interface DeleteUserSubscriptionResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _DeleteUserSubscriptionResponseBody> {}
export interface DeleteUserSubscriptionResponseBody
  extends Schema.Schema.Type<typeof _DeleteUserSubscriptionResponseBody> {}

export const DeleteUserSubscriptionResponseBody: Schema.Schema<
  DeleteUserSubscriptionResponseBody,
  DeleteUserSubscriptionResponseBodyEncoded
> = _DeleteUserSubscriptionResponseBody;
// #endregion DeleteUserSubscriptionResponseBody

// #region DeleteUserSubscriptionRequestParams
const _DeleteUserSubscriptionRequestParams = Schema.Struct({
  idSubscription: IdSubscription,
  idUser: IdUser,
}).pipe(
  Schema.annotations({ identifier: "DeleteUserSubscriptionRequestParams" })
);

export type DeleteUserSubscriptionRequestParamsContext = Schema.Schema.Context<
  typeof _DeleteUserSubscriptionRequestParams
>;
export interface DeleteUserSubscriptionRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _DeleteUserSubscriptionRequestParams> {}
export interface DeleteUserSubscriptionRequestParams
  extends Schema.Schema.Type<typeof _DeleteUserSubscriptionRequestParams> {}

export const DeleteUserSubscriptionRequestParams: Schema.Schema<
  DeleteUserSubscriptionRequestParams,
  DeleteUserSubscriptionRequestParamsEncoded
> = _DeleteUserSubscriptionRequestParams;
// #endregion DeleteUserSubscriptionRequestParams

export const DeleteUserSubscriptionEndpoint = HttpApiEndpoint.del(
  "deleteUserSubscription",
  "/users/:idUser/subscriptions/:idSubscription"
)
  .annotate(Description, "Unsubscribe user from events of some place")
  .setPath(DeleteUserSubscriptionRequestParams)
  .addSuccess(DeleteUserSubscriptionResponseBody);
