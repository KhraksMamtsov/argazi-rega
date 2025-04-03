import { Schema } from "effect";

import { IdVisitor } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../Visitor.api.js";
import { HttpApiEndpoint } from "@effect/platform";
import { Empty } from "@effect/platform/HttpApiSchema";

// #region GetVisitorResponseBody
const _GetVisitorResponseBody = VisitorApi.pipe(
  Schema.annotations({ identifier: "GetVisitorResponse" }),
  BaseResponseFor
).pipe(Schema.annotations({ identifier: "GetVisitorResponseBody" }));

export type GetVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _GetVisitorResponseBody
>;
export interface GetVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetVisitorResponseBody> {}
export interface GetVisitorResponseBody
  extends Schema.Schema.Type<typeof _GetVisitorResponseBody> {}

export const GetVisitorResponseBody: Schema.Schema<
  GetVisitorResponseBody,
  GetVisitorResponseBodyEncoded
> = _GetVisitorResponseBody;
// #endregion GetVisitorResponseBody

// #region GetVisitorRequestParams
const _GetVisitorRequestParams = Schema.Struct({
  idVisitor: IdVisitor,
}).pipe(Schema.annotations({ identifier: "GetVisitorRequestParams" }));

export type GetVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _GetVisitorRequestParams
>;
export interface GetVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetVisitorRequestParams> {}
export interface GetVisitorRequestParams
  extends Schema.Schema.Type<typeof _GetVisitorRequestParams> {}

export const GetVisitorRequestParams: Schema.Schema<
  GetVisitorRequestParams,
  GetVisitorRequestParamsEncoded
> = _GetVisitorRequestParams;
// #endregion GetVisitorRequestParams

export const GetVisitorEndpoint = HttpApiEndpoint.get(
  "getVisitor",
  "/visitors/:idVisitor"
)
  .setPath(GetVisitorRequestParams)
  .addSuccess(GetVisitorResponseBody)
  .addError(Empty(404));
