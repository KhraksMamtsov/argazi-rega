import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region GetMyVisitorsResponseBody
export const _GetMyVisitorsResponseBodySchema = VisitorApi.pipe(
  Schema.identifier("GetMyVisitorsResponseSchema"),
  BaseResponseManyFor
);

export type GetMyVisitorsResponseBodyContext = Schema.Schema.Context<
  typeof _GetMyVisitorsResponseBodySchema
>;
export interface GetMyVisitorsResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetMyVisitorsResponseBodySchema> {}
export interface GetMyVisitorsResponseBody
  extends Schema.Schema.Type<typeof _GetMyVisitorsResponseBodySchema> {}

export const GetMyVisitorsResponseBodySchema: Schema.Schema<
  GetMyVisitorsResponseBody,
  GetMyVisitorsResponseBodyEncoded
> = _GetMyVisitorsResponseBodySchema;
// #endregion GetMyVisitorsResponseBodySchema

export const GetMyVisitorsEndpoint = ApiEndpoint.get(
  "getMyVisitors",
  "/my/visitors",
  {
    summary: "Get user's visitors",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMyVisitorsResponseBodySchema),
  ApiEndpoint.setSecurity(BearerAuth)
);
