import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, SecurityScheme } from "effect-http";

import { _SS } from "@argazi/shared";

import { TokensResponse, TokensResponseSchema } from "../Tokens.response.js";

export const LoginBasicResponseBodySchema = TokensResponseSchema.pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("LoginBasicResponseBodySchema")
);

export const LoginBasicEndpoint = ApiEndpoint.post(
	"loginBasic",
	"/authentication/login-basic",
	{}
).pipe(
	ApiEndpoint.setRequestBody(LoginBasicResponseBodySchema),
	ApiEndpoint.setResponse(TokensResponse),
	ApiEndpoint.addSecurity(
		"basic",
		SecurityScheme.basic({
			tokenSchema: Schema.Secret,
		})
	)
);
