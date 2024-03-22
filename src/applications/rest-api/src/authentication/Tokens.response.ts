import * as Schema from "@effect/schema/Schema";
import { ApiResponse } from "effect-http";

import { _SS } from "@argazi/shared";

import { AccessTokenSchema } from "./AccessToken.js";
import { RefreshTokenSchema } from "./RefreshToken.js";

export const _TokensResponseSchema = Schema.struct({
  accessToken: AccessTokenSchema,
  refreshToken: RefreshTokenSchema,
}).pipe(_SS.satisfies.from.json(), Schema.identifier("TokensResponseSchema"));

export interface ApiCredentialsEncoded
  extends Schema.Schema.Encoded<typeof _TokensResponseSchema> {}
export interface ApiCredentials
  extends Schema.Schema.Type<typeof _TokensResponseSchema> {}

export const TokensResponseSchema: Schema.Schema<
  ApiCredentials,
  ApiCredentialsEncoded
> = _TokensResponseSchema;

export const TokensResponse = ApiResponse.make(200).pipe(
  ApiResponse.setBody(TokensResponseSchema)
);
