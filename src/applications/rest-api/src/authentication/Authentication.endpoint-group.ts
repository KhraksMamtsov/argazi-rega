import { ApiGroup } from "effect-http";

import { LoginBasicEndpoint } from "./login-basic/LoginBasic.endpoint.js";
import { LoginDwbnEndpoint } from "./login-dwbn/LoginDwbn.endpoint.js";
import { RefreshTokenEndpoint } from "./refresh-token/RefreshToken.endpoint.js";

export const AuthenticationEndpointGroup = ApiGroup.make(
  "authentication",
  {}
).pipe(
  ApiGroup.addEndpoint(LoginBasicEndpoint),
  ApiGroup.addEndpoint(LoginDwbnEndpoint),
  ApiGroup.addEndpoint(RefreshTokenEndpoint)
);
