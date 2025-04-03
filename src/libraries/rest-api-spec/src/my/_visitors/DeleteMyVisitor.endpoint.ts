import { Schema } from "effect";

import { IdVisitor } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";
import { HttpApiEndpoint } from "@effect/platform";

// #region DeleteMyVisitorResponseBody
const _DeleteMyVisitorResponseBody = VisitorApi.pipe(
  Schema.annotations({ identifier: "_DeleteMyVisitorResponseBody" }),
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
}).pipe(Schema.annotations({ identifier: "DeleteMyVisitorRequestParams" }));

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

export const DeleteMyVisitorEndpoint = HttpApiEndpoint.del(
  "deleteMyVisitor",
  "/my/visitors/:idVisitor"
)
  .setPath(DeleteMyVisitorRequestParams)
  .addSuccess(DeleteMyVisitorResponseBody);
