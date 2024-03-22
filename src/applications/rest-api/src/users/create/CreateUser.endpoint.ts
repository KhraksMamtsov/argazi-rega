import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateUserCommandPayloadSchema } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { UserApi } from "../User.api.js";

// #region CreateUserRequestBody
const _CreateUserRequestBodySchema = CreateUserCommandPayloadSchema.pipe(
  Schema.identifier("CreateUserRequestBodySchema")
);

export type CreateUserRequestBodyContext = Schema.Schema.Context<
  typeof _CreateUserRequestBodySchema
>;
export interface CreateUserRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserRequestBodySchema> {}
export interface CreateUserRequestBody
  extends Schema.Schema.Type<typeof _CreateUserRequestBodySchema> {}

export const CreateUserRequestBodySchema: Schema.Schema<
  CreateUserRequestBody,
  CreateUserRequestBodyEncoded
> = _CreateUserRequestBodySchema;
// #endregion CreateUserRequestBodySchema

// #region CreateUserResponseBody
const _CreateUserResponseBodySchema = UserApi.pipe(
  Schema.identifier("CreateUserResponseBodySchema"),
  BaseResponseFor
);

export type CreateUserResponseBodyContext = Schema.Schema.Context<
  typeof _CreateUserResponseBodySchema
>;
export interface CreateUserResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserResponseBodySchema> {}
export interface CreateUserResponseBody
  extends Schema.Schema.Type<typeof _CreateUserResponseBodySchema> {}

export const CreateUserResponseBodySchema: Schema.Schema<
  CreateUserResponseBody,
  CreateUserResponseBodyEncoded
> = _CreateUserResponseBodySchema;
// #endregion CreateUserResponseBodySchema

export const CreateUserEndpoint = ApiEndpoint.post(
  "createUser",
  "/users",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreateUserRequestBodySchema),
  ApiEndpoint.setResponseBody(CreateUserResponseBodySchema),
  ApiEndpoint.setSecurity(BearerAuth)
);
