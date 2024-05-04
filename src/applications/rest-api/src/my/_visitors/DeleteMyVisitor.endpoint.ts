import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdVisitor } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region DeleteMyVisitorResponseBody
const _DeleteMyVisitorResponseBody = VisitorApi.pipe(
  Schema.identifier("_DeleteMyVisitorResponseBody"),
  BaseResponseFor
);

export type DeleteMyVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _DeleteMyVisitorResponseBody
>;
export interface DeleteMyVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMyVisitorResponseBody> {}
export interface DeleteMyVisitorResponseBody
  extends Schema.Schema.Type<typeof _DeleteMyVisitorResponseBody> {}

export const DeleteMyVisitorResponseBody: Schema.Schema<
  DeleteMyVisitorResponseBody,
  DeleteMyVisitorResponseBodyEncoded
> = _DeleteMyVisitorResponseBody;
// #endregion DeleteMyVisitorResponseBody

// #region DeleteMyVisitorRequestParams
const _DeleteMyVisitorRequestParams = Schema.Struct({
  idVisitor: IdVisitor,
}).pipe(Schema.identifier("DeleteMyVisitorRequestParams"));

export type DeleteMyVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _DeleteMyVisitorRequestParams
>;
export interface DeleteMyVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _DeleteMyVisitorRequestParams> {}
export interface DeleteMyVisitorRequestParams
  extends Schema.Schema.Type<typeof _DeleteMyVisitorRequestParams> {}

export const DeleteMyVisitorRequestParams: Schema.Schema<
  DeleteMyVisitorRequestParams,
  DeleteMyVisitorRequestParamsEncoded
> = _DeleteMyVisitorRequestParams;
// #endregion DeleteMyVisitorRequestParams

export const DeleteMyVisitorEndpoint = ApiEndpoint.delete(
  "deleteMyVisitor",
  "/my/visitors/:idVisitor",
  {
    summary: "Deletes user's visitor",
  }
).pipe(
  ApiEndpoint.setSecurity(BearerAuth),
  ApiEndpoint.setRequestPath(DeleteMyVisitorRequestParams),
  ApiEndpoint.setResponseBody(DeleteMyVisitorResponseBody)
);
