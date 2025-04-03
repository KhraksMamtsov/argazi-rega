import { Schema } from "effect";

import { AccessToken } from "./AccessToken.js";
import { RefreshToken } from "./RefreshToken.js";

export class CredentialsResponse extends Schema.Class<CredentialsResponse>(
  "CredentialsResponse"
)({
  accessToken: AccessToken,
  refreshToken: RefreshToken,
}) {}
