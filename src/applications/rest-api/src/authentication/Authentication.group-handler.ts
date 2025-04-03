import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { LoginBasicHandlerLive } from "./login-basic/LoginBasic.handler.js";
import { LoginDwbnHandlerLive } from "./login-dwbn/LoginDwbn.handler.js";
import { RefreshTokenHandlerLive } from "./refresh-token/RefreshToken.handler.js";

export const AuthenticationGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Authentication",
  (handlers) =>
    handlers
      .handle("loginBasic", LoginBasicHandlerLive)
      .handle("loginDwbn", LoginDwbnHandlerLive)
      .handle("refreshToken", RefreshTokenHandlerLive)
);
