import { Schema } from "effect";

import { IdTelegramChat } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { CredentialsResponse } from "../Credentials.response.js";
import { HttpApiEndpoint } from "@effect/platform";

export class LoginDwbnRequestBody extends Schema.Class<LoginDwbnRequestBody>(
  "LoginDwbnRequestBody"
)({
  code: Schema.NonEmptyTrimmedString,
  idTelegramChat: IdTelegramChat,
}) {}

export class LoginDwbnResponseBody extends Schema.Class<LoginDwbnResponseBody>(
  "LoginDwbnResponseBody"
)({
  credentials: CredentialsResponse,
  idUser: IdUser,
}) {}

export const LoginDwbnEndpoint = HttpApiEndpoint.post(
  "loginDwbn",
  "/authentication/login-dwbn"
)
  .setPayload(LoginDwbnRequestBody)
  .addSuccess(LoginDwbnResponseBody);
