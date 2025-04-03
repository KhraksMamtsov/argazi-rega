import { Schema } from "effect";

import { IdSubscription } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../Subscription.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region GetSubscriptionByIdResponseBody
const _GetSubscriptionByIdResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "GetSubscriptionByIdResponseBody" }),
  BaseResponseFor
);

export type GetSubscriptionByIdResponseBodyContext = Schema.Schema.Context<
  typeof _GetSubscriptionByIdResponseBody
>;
export interface GetSubscriptionByIdResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetSubscriptionByIdResponseBody> {}
export interface GetSubscriptionByIdResponseBody
  extends Schema.Schema.Type<typeof _GetSubscriptionByIdResponseBody> {}

export const GetSubscriptionByIdResponseBody: Schema.Schema<
  GetSubscriptionByIdResponseBody,
  GetSubscriptionByIdResponseBodyEncoded
> = _GetSubscriptionByIdResponseBody;
// #endregion GetSubscriptionByIdResponseBody

// #region GetSubscriptionByIdRequestParams
const _GetSubscriptionByIdRequestParams = Schema.Struct({
  idSubscription: IdSubscription,
}).pipe(Schema.annotations({ identifier: "GetSubscriptionByIdRequestParams" }));

export type GetSubscriptionByIdRequestParamsContext = Schema.Schema.Context<
  typeof _GetSubscriptionByIdRequestParams
>;
export interface GetSubscriptionByIdRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetSubscriptionByIdRequestParams> {}
export interface GetSubscriptionByIdRequestParams
  extends Schema.Schema.Type<typeof _GetSubscriptionByIdRequestParams> {}

export const GetSubscriptionByIdRequestParams: Schema.Schema<
  GetSubscriptionByIdRequestParams,
  GetSubscriptionByIdRequestParamsEncoded
> = _GetSubscriptionByIdRequestParams;
// #endregion GetSubscriptionByIdRequestParams

export const GetSubscriptionByIdEndpoint = HttpApiEndpoint.get(
  "getSubscription",
  "/subscriptions/:idSubscription"
)
  .setPath(GetSubscriptionByIdRequestParams)
  .addSuccess(GetSubscriptionByIdResponseBody)
  .addError(
    Schema.String.pipe(
      Schema.annotations({
        description: "Subscription not found",
      })
    ),
    { status: 400 }
  );
