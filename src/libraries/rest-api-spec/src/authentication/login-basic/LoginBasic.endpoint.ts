import { Schema } from "effect";

import { _SS } from "@argazi/shared";

import { CredentialsResponse } from "../Credentials.response.js";
import { HttpApiEndpoint } from "@effect/platform";
import { BasicAuthentication } from "../../_security/BasicAuth.security.js";

export const LoginBasicResponseBody = CredentialsResponse.pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "LoginBasicResponseBody" })
);

export const LoginBasicEndpoint = HttpApiEndpoint.post(
  "loginBasic",
  "/authentication/login-basic"
)
  .addSuccess(LoginBasicResponseBody)
  .middleware(BasicAuthentication);
