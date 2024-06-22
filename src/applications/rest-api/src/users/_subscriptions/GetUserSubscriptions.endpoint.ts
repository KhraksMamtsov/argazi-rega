import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdUser } from "@argazi/domain";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";

// #region GetUserSubscriptionsResponseBody
const _GetUserSubscriptionsResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "GetUserSubscriptionsResponseBody" }),
  BaseResponseManyFor
);

export type GetUserSubscriptionsResponseBodyContext = Schema.Schema.Context<
  typeof _GetUserSubscriptionsResponseBody
>;
export interface GetUserSubscriptionsResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetUserSubscriptionsResponseBody> {}
export interface GetUserSubscriptionsResponseBody
  extends Schema.Schema.Type<typeof _GetUserSubscriptionsResponseBody> {}

export const GetUserSubscriptionsResponseBody: Schema.Schema<
  GetUserSubscriptionsResponseBody,
  GetUserSubscriptionsResponseBodyEncoded
> = _GetUserSubscriptionsResponseBody;
// #endregion GetUserSubscriptionsResponseBody

// #region GetUserSubscriptionsRequestParams
const _GetUserSubscriptionsRequestParams = Schema.Struct({
  idUser: IdUser,
}).pipe(
  Schema.annotations({ identifier: "GetUserSubscriptionsRequestParams" })
);

export type GetUserSubscriptionsRequestParamsContext = Schema.Schema.Context<
  typeof _GetUserSubscriptionsRequestParams
>;
export interface GetUserSubscriptionsRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetUserSubscriptionsRequestParams> {}
export interface GetUserSubscriptionsRequestParams
  extends Schema.Schema.Type<typeof _GetUserSubscriptionsRequestParams> {}

export const GetUserSubscriptionsRequestParams: Schema.Schema<
  GetUserSubscriptionsRequestParams,
  GetUserSubscriptionsRequestParamsEncoded
> = _GetUserSubscriptionsRequestParams;
// #endregion GetUserSubscriptionsRequestParams

export const GetUserSubscriptionsEndpoint = ApiEndpoint.get(
  "getUserSubscriptions",
  "/users/:idUser/subscriptions",
  {
    summary: "Get all user's subscriptions",
  }
).pipe(
  ApiEndpoint.setRequestPath(GetUserSubscriptionsRequestParams),
  ApiEndpoint.setResponseBody(GetUserSubscriptionsResponseBody)
);
