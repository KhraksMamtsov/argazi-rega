import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdTelegramChatSchema } from "../../../../libraries/domain/src/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../../libraries/domain/src/user/entity/IdUser.js";
import { TokensResponseSchema } from "../Tokens.response.js";

export const _LoginDwbnRequestBodySchema = Schema.struct({
	code: Schema.compose(Schema.Trim, Schema.NonEmpty),
	idTelegramChat: IdTelegramChatSchema,
}).pipe(Schema.identifier("LoginDwbnRequestBodySchema"));

export interface LoginDwbnRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _LoginDwbnRequestBodySchema> {}
export interface LoginDwbnRequestBody
	extends Schema.Schema.Type<typeof _LoginDwbnRequestBodySchema> {}

export const LoginDwbnRequestBodySchema: Schema.Schema<
	LoginDwbnRequestBody,
	LoginDwbnRequestBodyEncoded
> = _LoginDwbnRequestBodySchema;

export const _LoginDwbnResponseBodySchema = Schema.struct({
	credentials: TokensResponseSchema,
	idUser: IdUserSchema,
}).pipe(Schema.identifier("LoginDwbnResponseBodySchema"));

export interface LoginDwbnResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _LoginDwbnResponseBodySchema> {}
export interface LoginDwbnResponseBody
	extends Schema.Schema.Type<typeof _LoginDwbnResponseBodySchema> {}

export const LoginDwbnResponseBodySchema: Schema.Schema<
	LoginDwbnResponseBody,
	LoginDwbnResponseBodyEncoded
> = _LoginDwbnResponseBodySchema;

export const LoginDwbnEndpoint = ApiEndpoint.post(
	"loginDwbn",
	"/authentication/login-dwbn",
	{}
).pipe(
	ApiEndpoint.setRequestBody(LoginDwbnRequestBodySchema),
	ApiEndpoint.setResponseBody(LoginDwbnResponseBodySchema)
);
