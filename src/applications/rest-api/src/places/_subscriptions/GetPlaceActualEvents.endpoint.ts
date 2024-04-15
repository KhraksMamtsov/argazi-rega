import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlaceSchema } from "@argazi/domain";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { EventApi } from "../../events/Event.api.js";

// #region Schema for GetPlaceActualEventsResponseBody
const _GetPlaceActualEventsResponseBodySchema = EventApi.pipe(
  Schema.identifier("GetPlaceActualEventsResponseSchema"),
  BaseResponseManyFor
);

export type GetPlaceActualEventsResponseBodyContext = Schema.Schema.Context<
  typeof _GetPlaceActualEventsResponseBodySchema
>;
export interface GetPlaceActualEventsResponseBodyEncoded
  extends Schema.Schema.Encoded<
    typeof _GetPlaceActualEventsResponseBodySchema
  > {}
export interface GetPlaceActualEventsResponseBody
  extends Schema.Schema.Type<typeof _GetPlaceActualEventsResponseBodySchema> {}

export const GetPlaceActualEventsResponseBodySchema: Schema.Schema<
  GetPlaceActualEventsResponseBody,
  GetPlaceActualEventsResponseBodyEncoded
> = _GetPlaceActualEventsResponseBodySchema;
// #endregion Schema for  GetPlaceActualEventsResponseBodySchema

// #region GetPlaceActualEventsRequestParams
const _GetPlaceActualEventsRequestParamsSchema = Schema.Struct({
  idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("GetPlaceActualEventsRequestParamsSchema"));

export type GetPlaceActualEventsRequestParamsContext = Schema.Schema.Context<
  typeof _GetPlaceActualEventsRequestParamsSchema
>;
export interface GetPlaceActualEventsRequestParamsEncoded
  extends Schema.Schema.Encoded<
    typeof _GetPlaceActualEventsRequestParamsSchema
  > {}
export interface GetPlaceActualEventsRequestParams
  extends Schema.Schema.Type<typeof _GetPlaceActualEventsRequestParamsSchema> {}

export const GetPlaceActualEventsRequestParamsSchema: Schema.Schema<
  GetPlaceActualEventsRequestParams,
  GetPlaceActualEventsRequestParamsEncoded
> = _GetPlaceActualEventsRequestParamsSchema;
// #endregion GetPlaceActualEventsRequestParamsSchema

export const GetPlaceActualEventsEndpoint = ApiEndpoint.get(
  "getPlaceActualEvents",
  "/places/:idPlace/actual-events"
).pipe(
  ApiEndpoint.setRequestPath(GetPlaceActualEventsRequestParamsSchema),
  ApiEndpoint.setResponseBody(GetPlaceActualEventsResponseBodySchema)
);
