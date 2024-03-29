import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateUsersVisitorCommandPayloadSchema } from "@argazi/application";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

// #region CreateUsersVisitorResponseBody
const _CreateUsersVisitorResponseBodySchema = VisitorApi.pipe(
  Schema.identifier("CreateUsersVisitorResponseBody"),
  BaseResponseFor
);

export type CreateUsersVisitorResponseBodyContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorResponseBodySchema
>;
export interface CreateUsersVisitorResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorResponseBodySchema> {}
export interface CreateUsersVisitorResponseBody
  extends Schema.Schema.Type<typeof _CreateUsersVisitorResponseBodySchema> {}

export const CreateUsersVisitorResponseBodySchema: Schema.Schema<
  CreateUsersVisitorResponseBody,
  CreateUsersVisitorResponseBodyEncoded
> = _CreateUsersVisitorResponseBodySchema;
// #endregion CreateUsersVisitorResponseBodySchema

// #region CreateUsersVisitorRequestBody
const _CreateUsersVisitorRequestBodySchema =
  CreateUsersVisitorCommandPayloadSchema.pipe(
    Schema.omit("idUser"),
    Schema.identifier("CreateUsersVisitorRequestBodySchema")
  );

export type CreateUsersVisitorRequestBodyContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorRequestBodySchema
>;
export interface CreateUsersVisitorRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorRequestBodySchema> {}
export interface CreateUsersVisitorRequestBody
  extends Schema.Schema.Type<typeof _CreateUsersVisitorRequestBodySchema> {}

export const CreateUsersVisitorRequestBodySchema: Schema.Schema<
  CreateUsersVisitorRequestBody,
  CreateUsersVisitorRequestBodyEncoded
> = _CreateUsersVisitorRequestBodySchema;
// #endregion CreateUsersVisitorRequestBodySchema
// #region CreateUsersVisitorRequestParams
const _CreateUsersVisitorRequestParamsSchema = Schema.struct({
  idUser: IdUserSchema,
}).pipe(Schema.identifier("CreateUsersVisitorRequestParamsSchema"));

export type CreateUsersVisitorRequestParamsContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorRequestParamsSchema
>;
export interface CreateUsersVisitorRequestParamsEncoded
  extends Schema.Schema.Encoded<
    typeof _CreateUsersVisitorRequestParamsSchema
  > {}
export interface CreateUsersVisitorRequestParams
  extends Schema.Schema.Type<typeof _CreateUsersVisitorRequestParamsSchema> {}

export const CreateUsersVisitorRequestParamsSchema: Schema.Schema<
  CreateUsersVisitorRequestParams,
  CreateUsersVisitorRequestParamsEncoded
> = _CreateUsersVisitorRequestParamsSchema;
// #endregion CreateUsersVisitorRequestParamsSchema

export const CreateUsersVisitorEndpoint = ApiEndpoint.post(
  "createUsersVisitor",
  "/users/:idUser/visitors",
  {
    summary: "Creates user's visitor",
  }
).pipe(
  ApiEndpoint.setRequestPath(CreateUsersVisitorRequestParamsSchema),
  ApiEndpoint.setRequestBody(CreateUsersVisitorRequestBodySchema),
  ApiEndpoint.setResponseBody(CreateUsersVisitorResponseBodySchema),
  ApiEndpoint.setSecurity(BearerAuth)
);
