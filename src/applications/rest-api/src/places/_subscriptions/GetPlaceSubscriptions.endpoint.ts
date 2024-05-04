import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdPlace } from "@argazi/domain";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../../subscriptions/Subscription.api.js";

export const GetPlaceSubscriptionsResponse = SubscriptionApi.pipe(
  Schema.identifier("GetPlaceSubscriptionsResponse"),
  BaseResponseManyFor
);

// #region GetPlaceSubscriptionsRequestPath
const _GetPlaceSubscriptionsRequestPath = Schema.Struct({
  idPlace: IdPlace,
}).pipe(Schema.identifier("GetPlaceSubscriptionsRequestPath"));

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

export const GetPlaceSubscriptionsEndpoint = ApiEndpoint.get(
  "getPlaceSubscriptions",
  "/places/:idPlace/subscriptions",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetPlaceSubscriptionsRequestPath),
  ApiEndpoint.setResponse(ApiResponse.make(200, GetPlaceSubscriptionsResponse)),
  ApiEndpoint.addResponse(
    ApiResponse.make(
      404,
      Schema.String.pipe(Schema.description("PlaceSubscriptions not found"))
    )
  )
);
