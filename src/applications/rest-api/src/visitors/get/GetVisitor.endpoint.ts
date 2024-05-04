import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdVisitor } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../Visitor.api.js";

// #region GetVisitorResponseBody
const _GetVisitorResponseBody = VisitorApi.pipe(
  Schema.identifier("GetVisitorResponse"),
  BaseResponseFor
).pipe(Schema.identifier("GetVisitorResponseBody"));

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
}).pipe(Schema.identifier("GetVisitorRequestParams"));

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

export const GetVisitorEndpoint = ApiEndpoint.get(
  "getVisitor",
  "/visitors/:idVisitor",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetVisitorRequestParams),
  ApiEndpoint.setResponseBody(GetVisitorResponseBody)
);
