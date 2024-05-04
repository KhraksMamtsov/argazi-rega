import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdSubscription } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../Subscription.api.js";

// #region GetSubscriptionByIdResponseBody
const _GetSubscriptionByIdResponseBody = SubscriptionApi.pipe(
  Schema.identifier("GetSubscriptionByIdResponseBody"),
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
}).pipe(Schema.identifier("GetSubscriptionByIdRequestParams"));

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

export const GetSubscriptionByIdEndpoint = ApiEndpoint.get(
  "getSubscription",
  "/subscriptions/:idSubscription",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetSubscriptionByIdRequestParams),
  ApiEndpoint.setResponse(
    ApiResponse.make(200, GetSubscriptionByIdResponseBody)
  ),
  ApiEndpoint.addResponse(
    ApiResponse.make(
      400,
      Schema.String.pipe(Schema.description("Subscription not found"))
    )
  )
);
