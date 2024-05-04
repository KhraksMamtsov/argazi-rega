import * as Schema from "@effect/schema/Schema";
import { Api, ApiEndpoint, Security } from "effect-http";

import { _SS } from "@argazi/shared";

import { TokensResponse, CredentialsApi } from "../Tokens.response.js";

export const LoginBasicResponseBody = CredentialsApi.pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("LoginBasicResponseBody")
);

export const LoginBasicEndpoint = ApiEndpoint.post(
  "loginBasic",
  "/authentication/login-basic",
  {}
).pipe(
  ApiEndpoint.setResponseBody(LoginBasicResponseBody),
  ApiEndpoint.setResponse(TokensResponse),
  Api.setSecurity(
    Security.basic({
      name: "basic",
    })
  )
);
