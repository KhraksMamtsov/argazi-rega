import * as Schema from "@effect/schema/Schema";

import { AccessTokenSchema } from "./AccessToken.js";
import { RefreshTokenSchema } from "./RefreshToken.js";

import { satisfies } from "../../../libs/SchemaSatisfy.js";

export const TokensResponseSchema = Schema.struct({
	accessToken: AccessTokenSchema,
	refreshToken: RefreshTokenSchema,
}).pipe(satisfies.from.json(), Schema.identifier("TokensResponseSchema"));

export type ApiCredentials = Schema.Schema.To<typeof TokensResponseSchema>;

export const TokensResponse = {
	content: TokensResponseSchema,
	status: 200 as const,
} as const;
