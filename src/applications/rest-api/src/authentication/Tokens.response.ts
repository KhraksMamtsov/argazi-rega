import * as Schema from "@effect/schema/Schema";
import { ApiResponse } from "effect-http";

import { _SS } from "@argazi/shared";

import { AccessTokenSchema } from "./AccessToken.js";
import { RefreshTokenSchema } from "./RefreshToken.js";

export const _TokensResponseSchema = Schema.Struct({
  accessToken: AccessTokenSchema,
  refreshToken: RefreshTokenSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("TokensResponseSchema")
);

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
