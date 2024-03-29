import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdVisitorSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../Visitor.api.js";

// #region GetVisitorResponseBody
const _GetVisitorResponseBodySchema = VisitorApi.pipe(
  Schema.identifier("GetVisitorResponseSchema"),
  BaseResponseFor
).pipe(Schema.identifier("GetVisitorResponseBodySchema"));

export type GetVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _GetVisitorResponseBodySchema
>;
export interface GetVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetVisitorResponseBodySchema> {}
export interface GetVisitorResponseBody
  extends Schema.Schema.Type<typeof _GetVisitorResponseBodySchema> {}

export const GetVisitorResponseBodySchema: Schema.Schema<
  GetVisitorResponseBody,
  GetVisitorResponseBodyEncoded
> = _GetVisitorResponseBodySchema;
// #endregion GetVisitorResponseBodySchema

// #region GetVisitorRequestParams
const _GetVisitorRequestParamsSchema = Schema.struct({
  idVisitor: IdVisitorSchema,
}).pipe(Schema.identifier("GetVisitorRequestParamsSchema"));

export type GetVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _GetVisitorRequestParamsSchema
>;
export interface GetVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetVisitorRequestParamsSchema> {}
export interface GetVisitorRequestParams
  extends Schema.Schema.Type<typeof _GetVisitorRequestParamsSchema> {}

export const GetVisitorRequestParamsSchema: Schema.Schema<
  GetVisitorRequestParams,
  GetVisitorRequestParamsEncoded
> = _GetVisitorRequestParamsSchema;
// #endregion GetVisitorRequestParamsSchema

export const GetVisitorEndpoint = ApiEndpoint.get(
  "getVisitor",
  "/visitors/:idVisitor",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetVisitorRequestParamsSchema),
  ApiEndpoint.setResponseBody(GetVisitorResponseBodySchema)
);
