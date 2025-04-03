import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { EventApi } from "../../events/Event.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region Schema for GetPlaceActualEventsResponseBody
const _GetPlaceActualEventsResponseBody = EventApi.pipe(
  Schema.annotations({ identifier: "GetPlaceActualEventsResponse" }),
  BaseResponseManyFor
);

export type GetPlaceActualEventsResponseBodyContext = Schema.Schema.Context<
  typeof _GetPlaceActualEventsResponseBody
>;
export interface GetPlaceActualEventsResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceActualEventsResponseBody> {}
export interface GetPlaceActualEventsResponseBody
  extends Schema.Schema.Type<typeof _GetPlaceActualEventsResponseBody> {}

export const GetPlaceActualEventsResponseBody: Schema.Schema<
  GetPlaceActualEventsResponseBody,
  GetPlaceActualEventsResponseBodyEncoded
> = _GetPlaceActualEventsResponseBody;
// #endregion Schema for  GetPlaceActualEventsResponseBody

// #region GetPlaceActualEventsRequestParams
const _GetPlaceActualEventsRequestParams = Schema.Struct({
  idPlace: IdPlace,
}).pipe(
  Schema.annotations({ identifier: "GetPlaceActualEventsRequestParams" })
);

export type GetPlaceActualEventsRequestParamsContext = Schema.Schema.Context<
  typeof _GetPlaceActualEventsRequestParams
>;
export interface GetPlaceActualEventsRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetPlaceActualEventsRequestParams> {}
export interface GetPlaceActualEventsRequestParams
  extends Schema.Schema.Type<typeof _GetPlaceActualEventsRequestParams> {}

export const GetPlaceActualEventsRequestParams: Schema.Schema<
  GetPlaceActualEventsRequestParams,
  GetPlaceActualEventsRequestParamsEncoded
> = _GetPlaceActualEventsRequestParams;
// #endregion GetPlaceActualEventsRequestParams

export const GetPlaceActualEventsEndpoint = HttpApiEndpoint.get(
  "getPlaceActualEvents",
  "/places/:idPlace/actual-events"
)
  .setPath(GetPlaceActualEventsRequestParams)
  .addSuccess(GetPlaceActualEventsResponseBody);
