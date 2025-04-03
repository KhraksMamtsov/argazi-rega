import { HttpApiGroup } from "@effect/platform";
import { LoginBasicEndpoint } from "./login-basic/LoginBasic.endpoint.js";
import { LoginDwbnEndpoint } from "./login-dwbn/LoginDwbn.endpoint.js";
import { RefreshTokenEndpoint } from "./refresh-token/RefreshToken.endpoint.js";

export class AuthenticationEndpointGroup extends HttpApiGroup.make(
  "Authentication"
)
  .add(LoginBasicEndpoint)
  .add(LoginDwbnEndpoint)
  .add(RefreshTokenEndpoint) {}
