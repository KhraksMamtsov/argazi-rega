import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateUserCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { UserApi } from "../User.api.js";

// #region CreateUserRequestBody
const _CreateUserRequestBody = CreateUserCommandPayload.pipe(
  Schema.identifier("CreateUserRequestBody")
);

export type CreateUserRequestBodyContext = Schema.Schema.Context<
  typeof _CreateUserRequestBody
>;
export interface CreateUserRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserRequestBody> {}
export interface CreateUserRequestBody
  extends Schema.Schema.Type<typeof _CreateUserRequestBody> {}

export const CreateUserRequestBody: Schema.Schema<
  CreateUserRequestBody,
  CreateUserRequestBodyEncoded
> = _CreateUserRequestBody;
// #endregion CreateUserRequestBody

// #region CreateUserResponseBody
const _CreateUserResponseBody = UserApi.pipe(
  Schema.identifier("CreateUserResponseBody"),
  BaseResponseFor
);

export type CreateUserResponseBodyContext = Schema.Schema.Context<
  typeof _CreateUserResponseBody
>;
export interface CreateUserResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateUserResponseBody> {}
export interface CreateUserResponseBody
  extends Schema.Schema.Type<typeof _CreateUserResponseBody> {}

export const CreateUserResponseBody: Schema.Schema<
  CreateUserResponseBody,
  CreateUserResponseBodyEncoded
> = _CreateUserResponseBody;
// #endregion CreateUserResponseBody

export const CreateUserEndpoint = ApiEndpoint.post(
  "createUser",
  "/users",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreateUserRequestBody),
  ApiEndpoint.setResponseBody(CreateUserResponseBody),
  ApiEndpoint.setSecurity(BearerAuth)
);
