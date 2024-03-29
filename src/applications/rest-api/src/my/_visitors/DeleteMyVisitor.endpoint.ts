import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdVisitorSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region DeleteMyVisitorResponseBody
const _DeleteMyVisitorResponseBodySchema = VisitorApi.pipe(
  Schema.identifier("_DeleteMyVisitorResponseBodySchema"),
  BaseResponseFor
);

export type DeleteMyVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _DeleteMyVisitorResponseBodySchema
>;
export interface DeleteMyVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMyVisitorResponseBodySchema> {}
export interface DeleteMyVisitorResponseBody
  extends Schema.Schema.Type<typeof _DeleteMyVisitorResponseBodySchema> {}

export const DeleteMyVisitorResponseBodySchema: Schema.Schema<
  DeleteMyVisitorResponseBody,
  DeleteMyVisitorResponseBodyEncoded
> = _DeleteMyVisitorResponseBodySchema;
// #endregion DeleteMyVisitorResponseBodySchema

// #region DeleteMyVisitorRequestParams
const _DeleteMyVisitorRequestParamsSchema = Schema.struct({
  idVisitor: IdVisitorSchema,
}).pipe(Schema.identifier("DeleteMyVisitorRequestParamsSchema"));

export type DeleteMyVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _DeleteMyVisitorRequestParamsSchema
>;
export interface DeleteMyVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMyVisitorRequestParamsSchema> {}
export interface DeleteMyVisitorRequestParams
  extends Schema.Schema.Type<typeof _DeleteMyVisitorRequestParamsSchema> {}

export const DeleteMyVisitorRequestParamsSchema: Schema.Schema<
  DeleteMyVisitorRequestParams,
  DeleteMyVisitorRequestParamsEncoded
> = _DeleteMyVisitorRequestParamsSchema;
// #endregion DeleteMyVisitorRequestParamsSchema

export const DeleteMyVisitorEndpoint = ApiEndpoint.delete(
  "deleteMyVisitor",
  "/my/visitors/:idVisitor",
  {
    summary: "Deletes user's visitor",
  }
).pipe(
  ApiEndpoint.setSecurity(BearerAuth),
  ApiEndpoint.setRequestPath(DeleteMyVisitorRequestParamsSchema),
  ApiEndpoint.setResponseBody(DeleteMyVisitorResponseBodySchema)
);
