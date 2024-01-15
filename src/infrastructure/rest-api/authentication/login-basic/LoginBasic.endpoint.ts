import * as Schema from "@effect/schema/Schema";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { TokensResponse, TokensResponseSchema } from "../Tokens.response.js";

export const LoginBasicResponseSchema = TokensResponseSchema.pipe(
	satisfies.from.json(),
	Schema.identifier("LoginBasicResponseSchema")
);

export const LoginBasicResponse = [TokensResponse] as const;
