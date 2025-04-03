import { Schema } from "effect";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region GetMyVisitorsResponseBody
export const _GetMyVisitorsResponseBody = VisitorApi.pipe(
  Schema.annotations({ identifier: "GetMyVisitorsResponse" }),
  BaseResponseManyFor
);

export type GetMyVisitorsResponseBodyContext = Schema.Schema.Context<
  typeof _GetMyVisitorsResponseBody
>;
export interface GetMyVisitorsResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetMyVisitorsResponseBody> {}
export interface GetMyVisitorsResponseBody
  extends Schema.Schema.Type<typeof _GetMyVisitorsResponseBody> {}

export const GetMyVisitorsResponseBody: Schema.Schema<
  GetMyVisitorsResponseBody,
  GetMyVisitorsResponseBodyEncoded
> = _GetMyVisitorsResponseBody;
// #endregion GetMyVisitorsResponseBody

export const GetMyVisitorsEndpoint = HttpApiEndpoint.get(
  "getMyVisitors",
  "/my/visitors"
).addSuccess(GetMyVisitorsResponseBody);
