import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdPlace } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";

// #region CreateMySubscriptionRequestBody
const _CreateMySubscriptionRequestBody = Schema.Struct({
  idPlace: IdPlace,
}).pipe(Schema.annotations({ identifier: "CreateMySubscriptionRequestBody" }));

export type CreateMySubscriptionRequestBodyContext = Schema.Schema.Context<
  typeof _CreateMySubscriptionRequestBody
>;
export interface CreateMySubscriptionRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateMySubscriptionRequestBody> {}
export interface CreateMySubscriptionRequestBody
  extends Schema.Schema.Type<typeof _CreateMySubscriptionRequestBody> {}

export const CreateMySubscriptionRequestBody: Schema.Schema<
  CreateMySubscriptionRequestBody,
  CreateMySubscriptionRequestBodyEncoded
> = _CreateMySubscriptionRequestBody;
// #endregion CreateMySubscriptionRequestBody

export const CreateMySubscriptionResponse = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "CreateMySubscriptionResponse" }),
  BaseResponseFor
);

// #region CreateMySubscriptionResponseBody
const _CreateMySubscriptionResponseBody = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "_CreateMySubscriptionResponseBody" }),
  BaseResponseFor
);

export type CreateMySubscriptionResponseBodyContext = Schema.Schema.Context<
  typeof _CreateMySubscriptionResponseBody
>;
export interface CreateMySubscriptionResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateMySubscriptionResponseBody> {}
export interface CreateMySubscriptionResponseBody
  extends Schema.Schema.Type<typeof _CreateMySubscriptionResponseBody> {}

export const CreateMySubscriptionResponseBody: Schema.Schema<
  CreateMySubscriptionResponseBody,
  CreateMySubscriptionResponseBodyEncoded
> = _CreateMySubscriptionResponseBody;
// #endregion CreateMySubscriptionResponseBody

export const CreateMySubscriptionEndpoint = HttpApiEndpoint.post(
  "createMySubscription",
  "/my/subscriptions"
)
  .setPayload(CreateMySubscriptionRequestBody)
  .addSuccess(CreateMySubscriptionResponseBody);
