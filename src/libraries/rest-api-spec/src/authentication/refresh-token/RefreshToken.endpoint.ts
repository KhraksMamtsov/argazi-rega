import { Schema } from "effect";

import { RefreshToken } from "../RefreshToken.js";
import { CredentialsResponse } from "../Credentials.response.js";
import { HttpApiEndpoint } from "@effect/platform";

export class RefreshTokenRequestBody extends Schema.Class<RefreshTokenRequestBody>(
  "RefreshTokenRequestBody"
)({
  refreshToken: RefreshToken,
}) {}

export const RefreshTokenEndpoint = HttpApiEndpoint.post(
  "refreshToken",
  "/authentication/refresh-token"
)
  .setPayload(RefreshTokenRequestBody)
  .addSuccess(CredentialsResponse);
