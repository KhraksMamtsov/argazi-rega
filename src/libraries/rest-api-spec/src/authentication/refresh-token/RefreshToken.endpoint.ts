import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { _SS } from "@argazi/shared";

import { RefreshToken } from "../RefreshToken.js";
import { TokensResponse } from "../Tokens.response.js";

export const _RefreshTokenRequestBody = Schema.Struct({
  refreshToken: RefreshToken,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "RefreshTokenRequest" })
);

export type RefreshTokenRequestBodyContext = Schema.Schema.Context<
  typeof _RefreshTokenRequestBody
>;
export interface RefreshTokenRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _RefreshTokenRequestBody> {}
export interface RefreshTokenRequestBody
  extends Schema.Schema.Type<typeof _RefreshTokenRequestBody> {}

export const RefreshTokenRequestBody: Schema.Schema<
  RefreshTokenRequestBody,
  RefreshTokenRequestBodyEncoded
> = _RefreshTokenRequestBody;

export const RefreshTokenEndpoint = ApiEndpoint.post(
  "refreshToken",
  "/authentication/refresh-token",
  {}
).pipe(
  ApiEndpoint.setRequestBody(RefreshTokenRequestBody),
  ApiEndpoint.setResponse(TokensResponse)
);
