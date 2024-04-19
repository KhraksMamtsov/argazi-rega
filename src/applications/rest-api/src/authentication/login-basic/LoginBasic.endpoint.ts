import * as Schema from "@effect/schema/Schema";
import { Api, ApiEndpoint, Security } from "effect-http";

import { _SS } from "@argazi/shared";

import { TokensResponse, TokensResponseSchema } from "../Tokens.response.js";

export const LoginBasicResponseBodySchema = TokensResponseSchema.pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("LoginBasicResponseBodySchema")
);

export const LoginBasicEndpoint = ApiEndpoint.post(
  "loginBasic",
  "/authentication/login-basic",
  {}
).pipe(
  ApiEndpoint.setResponseBody(LoginBasicResponseBodySchema),
  ApiEndpoint.setResponse(TokensResponse),
  Api.setSecurity(
    Security.basic({
      name: "basic",
    })
  )
);
