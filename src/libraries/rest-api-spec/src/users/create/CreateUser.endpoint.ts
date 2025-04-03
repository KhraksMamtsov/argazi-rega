import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { CreateUserCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region CreateUserRequestBody
const _CreateUserRequestBody = CreateUserCommandPayload.pipe(
  Schema.annotations({ identifier: "CreateUserRequestBody" })
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
  Schema.annotations({ identifier: "CreateUserResponseBody" }),
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

export const CreateUserEndpoint = HttpApiEndpoint.post("createUser", "/users")
  .setPayload(CreateUserRequestBody)
  .addSuccess(CreateUserResponseBody);
