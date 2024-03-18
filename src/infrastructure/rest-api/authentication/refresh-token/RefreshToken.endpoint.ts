import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { RefreshTokenSchema } from "../RefreshToken.js";
import { TokensResponse } from "../Tokens.response.js";

export const _RefreshTokenRequestBodySchema = Schema.struct({
	refreshToken: RefreshTokenSchema,
}).pipe(satisfies.from.json(), Schema.identifier("RefreshTokenRequestSchema"));

export type RefreshTokenRequestBodyContext = Schema.Schema.Context<
	typeof _RefreshTokenRequestBodySchema
>;
export interface RefreshTokenRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _RefreshTokenRequestBodySchema> {}
export interface RefreshTokenRequestBody
	extends Schema.Schema.Type<typeof _RefreshTokenRequestBodySchema> {}

export const RefreshTokenRequestBodySchema: Schema.Schema<
	RefreshTokenRequestBody,
	RefreshTokenRequestBodyEncoded
> = _RefreshTokenRequestBodySchema;

export const RefreshTokenEndpoint = ApiEndpoint.post(
	"refreshToken",
	"/authentication/refresh-token",
	{}
).pipe(
	ApiEndpoint.setRequestBody(RefreshTokenRequestBodySchema),
	ApiEndpoint.setResponse(TokensResponse)
);