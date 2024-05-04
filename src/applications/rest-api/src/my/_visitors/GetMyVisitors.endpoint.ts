import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region GetMyVisitorsResponseBody
export const _GetMyVisitorsResponseBody = VisitorApi.pipe(
  Schema.identifier("GetMyVisitorsResponse"),
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

export const GetMyVisitorsEndpoint = ApiEndpoint.get(
  "getMyVisitors",
  "/my/visitors",
  {
    summary: "Get user's visitors",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMyVisitorsResponseBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
