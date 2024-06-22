import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTelegramChat } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { CredentialsApi } from "../Tokens.response.js";

export const _LoginDwbnRequestBody = Schema.Struct({
  code: Schema.compose(Schema.Trim, Schema.NonEmpty),
  idTelegramChat: IdTelegramChat,
}).pipe(Schema.annotations({ identifier: "LoginDwbnRequestBody" }));

export interface LoginDwbnRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _LoginDwbnRequestBody> {}
export interface LoginDwbnRequestBody
  extends Schema.Schema.Type<typeof _LoginDwbnRequestBody> {}

export const LoginDwbnRequestBody: Schema.Schema<
  LoginDwbnRequestBody,
  LoginDwbnRequestBodyEncoded
> = _LoginDwbnRequestBody;

export const _LoginDwbnResponseBody = Schema.Struct({
  credentials: CredentialsApi,
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "LoginDwbnResponseBody" }));

export interface LoginDwbnResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _LoginDwbnResponseBody> {}
export interface LoginDwbnResponseBody
  extends Schema.Schema.Type<typeof _LoginDwbnResponseBody> {}

export const LoginDwbnResponseBody: Schema.Schema<
  LoginDwbnResponseBody,
  LoginDwbnResponseBodyEncoded
> = _LoginDwbnResponseBody;

export const LoginDwbnEndpoint = ApiEndpoint.post(
  "loginDwbn",
  "/authentication/login-dwbn",
  {}
).pipe(
  ApiEndpoint.setRequestBody(LoginDwbnRequestBody),
  ApiEndpoint.setResponseBody(LoginDwbnResponseBody)
);
