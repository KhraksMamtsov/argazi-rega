import * as Schema from "@effect/schema/Schema";
import { ApiResponse } from "effect-http";

import { _SS } from "@argazi/shared";

import { AccessToken } from "./AccessToken.js";
import { RefreshToken } from "./RefreshToken.js";

export const _CredentialsApi = Schema.Struct({
  accessToken: AccessToken,
  refreshToken: RefreshToken,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "TokensResponse" })
);

export interface CredentialsApiEncoded
  extends Schema.Schema.Encoded<typeof _CredentialsApi> {}
export interface CredentialsApi
  extends Schema.Schema.Type<typeof _CredentialsApi> {}

export const CredentialsApi: Schema.Schema<
  CredentialsApi,
  CredentialsApiEncoded
> = _CredentialsApi;

export const TokensResponse = ApiResponse.make(200).pipe(
  ApiResponse.setBody(CredentialsApi)
);
