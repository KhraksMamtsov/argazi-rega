import * as Schema from "@effect/schema/Schema";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { RefreshTokenSchema } from "../RefreshToken.js";
import { TokensResponse } from "../Tokens.response.js";

export const RefreshTokenRequestSchema = {
	body: Schema.struct({
		refreshToken: RefreshTokenSchema,
	}).pipe(
		satisfies.from.json(),
		Schema.identifier("RefreshTokenRequestSchema")
	),
};

export type RefreshTokenRequestBody = Schema.Schema.To<
	typeof RefreshTokenRequestSchema.body
>;

export const RefreshTokenResponse = [
	TokensResponse,
	// {
	//   status: 404,
	//   content: Schema.string,
	// },
] as const;
