import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdPlace } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";
import { Description } from "@effect/platform/OpenApi";

// #region CreateUserSubscriptionResponseBody
const _CreateUserSubscriptionResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "CreateUserSubscriptionResponseBody" }),
  BaseResponseFor
);

export type CreateUserSubscriptionResponseBodyContext = Schema.Schema.Context<
  typeof _CreateUserSubscriptionResponseBody
>;
export interface CreateUserSubscriptionResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserSubscriptionResponseBody> {}
export interface CreateUserSubscriptionResponseBody
  extends Schema.Schema.Type<typeof _CreateUserSubscriptionResponseBody> {}

export const CreateUserSubscriptionResponseBody: Schema.Schema<
  CreateUserSubscriptionResponseBody,
  CreateUserSubscriptionResponseBodyEncoded
> = _CreateUserSubscriptionResponseBody;
// #endregion CreateUserSubscriptionResponseBody

// #region CreateUserSubscriptionRequestBody
const _CreateUserSubscriptionRequestBody = Schema.Struct({
  idPlace: IdPlace,
}).pipe(
  Schema.annotations({ identifier: "CreateUserSubscriptionRequestBody" })
);

export type CreateUserSubscriptionRequestBodyContext = Schema.Schema.Context<
  typeof _CreateUserSubscriptionRequestBody
>;
export interface CreateUserSubscriptionRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserSubscriptionRequestBody> {}
export interface CreateUserSubscriptionRequestBody
  extends Schema.Schema.Type<typeof _CreateUserSubscriptionRequestBody> {}

export const CreateUserSubscriptionRequestBody: Schema.Schema<
  CreateUserSubscriptionRequestBody,
  CreateUserSubscriptionRequestBodyEncoded
> = _CreateUserSubscriptionRequestBody;
// #endregion CreateUserSubscriptionRequestBody
// #region CreateUserSubscriptionRequestParams
const _CreateUserSubscriptionRequestParams = Schema.Struct({
  idUser: IdUser,
}).pipe(
  Schema.annotations({ identifier: "CreateUserSubscriptionRequestParams" })
);

export type CreateUserSubscriptionRequestParamsContext = Schema.Schema.Context<
  typeof _CreateUserSubscriptionRequestParams
>;
export interface CreateUserSubscriptionRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserSubscriptionRequestParams> {}
export interface CreateUserSubscriptionRequestParams
  extends Schema.Schema.Type<typeof _CreateUserSubscriptionRequestParams> {}

export const CreateUserSubscriptionRequestParams: Schema.Schema<
  CreateUserSubscriptionRequestParams,
  CreateUserSubscriptionRequestParamsEncoded
> = _CreateUserSubscriptionRequestParams;
// #endregion CreateUserSubscriptionRequestParams

export const CreateUserSubscriptionEndpoint = HttpApiEndpoint.post(
  "createUserSubscription",
  "/users/:idUser/subscriptions"
)
  .annotate(Description, "Subscribe user on events of some place")
  .setPath(CreateUserSubscriptionRequestParams)
  .setPayload(CreateUserSubscriptionRequestBody)
  .addSuccess(CreateUserSubscriptionResponseBody);
