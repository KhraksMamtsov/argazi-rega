import { Schema } from "effect";
import { HttpApiEndpoint, OpenApi } from "@effect/platform";

import { CreateUsersVisitorCommandPayload } from "@argazi/application";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region CreateUsersVisitorResponseBody
const _CreateUsersVisitorResponseBody = VisitorApi.pipe(
  Schema.annotations({ identifier: "CreateUsersVisitorResponseBody" }),
  BaseResponseFor
);

export type CreateUsersVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorResponseBody
>;
export interface CreateUsersVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorResponseBody> {}
export interface CreateUsersVisitorResponseBody
  extends Schema.Schema.Type<typeof _CreateUsersVisitorResponseBody> {}

export const CreateUsersVisitorResponseBody: Schema.Schema<
  CreateUsersVisitorResponseBody,
  CreateUsersVisitorResponseBodyEncoded
> = _CreateUsersVisitorResponseBody;
// #endregion CreateUsersVisitorResponseBody

// #region CreateUsersVisitorRequestBody
const _CreateUsersVisitorRequestBody = CreateUsersVisitorCommandPayload.pipe(
  Schema.omit("idUser"),
  Schema.annotations({ identifier: "CreateUsersVisitorRequestBody" })
);

export type CreateUsersVisitorRequestBodyContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorRequestBody
>;
export interface CreateUsersVisitorRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorRequestBody> {}
export interface CreateUsersVisitorRequestBody
  extends Schema.Schema.Type<typeof _CreateUsersVisitorRequestBody> {}

export const CreateUsersVisitorRequestBody: Schema.Schema<
  CreateUsersVisitorRequestBody,
  CreateUsersVisitorRequestBodyEncoded
> = _CreateUsersVisitorRequestBody;
// #endregion CreateUsersVisitorRequestBody
// #region CreateUsersVisitorRequestParams
const _CreateUsersVisitorRequestParams = Schema.Struct({
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "CreateUsersVisitorRequestParams" }));

export type CreateUsersVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorRequestParams
>;
export interface CreateUsersVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorRequestParams> {}
export interface CreateUsersVisitorRequestParams
  extends Schema.Schema.Type<typeof _CreateUsersVisitorRequestParams> {}

export const CreateUsersVisitorRequestParams: Schema.Schema<
  CreateUsersVisitorRequestParams,
  CreateUsersVisitorRequestParamsEncoded
> = _CreateUsersVisitorRequestParams;
// #endregion CreateUsersVisitorRequestParams

export const CreateUsersVisitorEndpoint = HttpApiEndpoint.post(
  "createUsersVisitor",
  "/users/:idUser/visitors"
)
  .annotate(OpenApi.Description, "Creates user's visitor")
  .setPath(CreateUsersVisitorRequestParams)
  .setPayload(CreateUsersVisitorRequestBody)
  .addSuccess(CreateUsersVisitorResponseBody);
