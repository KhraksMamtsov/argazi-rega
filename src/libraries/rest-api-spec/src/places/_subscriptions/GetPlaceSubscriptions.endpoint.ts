import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const GetPlaceSubscriptionsResponse = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "GetPlaceSubscriptionsResponse" }),
  BaseResponseManyFor
);

// #region GetPlaceSubscriptionsRequestPath
const _GetPlaceSubscriptionsRequestPath = Schema.Struct({
  idPlace: IdPlace,
}).pipe(Schema.annotations({ identifier: "GetPlaceSubscriptionsRequestPath" }));

export type GetPlaceSubscriptionsRequestPathContext = Schema.Schema.Context<
  typeof _GetPlaceSubscriptionsRequestPath
>;
export interface GetPlaceSubscriptionsRequestPathEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceSubscriptionsRequestPath> {}
export interface GetPlaceSubscriptionsRequestPath
  extends Schema.Schema.Type<typeof _GetPlaceSubscriptionsRequestPath> {}

export const GetPlaceSubscriptionsRequestPath: Schema.Schema<
  GetPlaceSubscriptionsRequestPath,
  GetPlaceSubscriptionsRequestPathEncoded
> = _GetPlaceSubscriptionsRequestPath;
// #endregion GetPlaceSubscriptionsRequestPath

export const GetPlaceSubscriptionsEndpoint = HttpApiEndpoint.get(
  "getPlaceSubscriptions",
  "/places/:idPlace/subscriptions"
)
  .setPath(GetPlaceSubscriptionsRequestPath)
  .addSuccess(GetPlaceSubscriptionsResponse)
  .addError(
    Schema.String.pipe(
      Schema.annotations({ description: "PlaceSubscriptions not found" })
    ),
    { status: 400 }
  );
