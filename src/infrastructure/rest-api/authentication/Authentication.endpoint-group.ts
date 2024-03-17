import * as Schema from "@effect/schema/Schema";
import { Api, SecurityScheme } from "effect-http";

import * as AuthBasicEndpoint from "./login-basic/LoginBasic.endpoint.js";
import * as AuthDwbnEndpoint from "./login-dwbn/LoginDwbn.api.js";
import * as AuthRefreshEndpoint from "./refresh-token/RefreshToken.api.js";

export const AuthenticationEndpointGroup = Api.apiGroup("authentication").pipe(
	Api.post("loginDwbn", "/authentication/login-dwbn", {
		request: AuthDwbnEndpoint.LoginDwbnRequest,
		response: AuthDwbnEndpoint.LoginDwbnResponse,
	}),
	Api.post(
		"loginBasic",
		"/authentication/login-basic",
		{
			response: AuthBasicEndpoint.LoginBasicResponse,
		},
		{
			security: {
				basic: SecurityScheme.basic({
					tokenSchema: Schema.Secret,
				}),
			},
		}
	),
	Api.post("refreshAuthentication", "/authentication/refresh", {
		request: AuthRefreshEndpoint.RefreshTokenRequestSchema,
		response: AuthRefreshEndpoint.RefreshTokenResponse,
	})
);
