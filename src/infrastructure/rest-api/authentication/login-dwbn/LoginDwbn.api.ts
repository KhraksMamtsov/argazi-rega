import * as Schema from "@effect/schema/Schema";

import { IdTelegramChatSchema } from "../../../../domain/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { TokensResponseSchema } from "../Tokens.response.js";

export const LoginDwbnResponseSchema = TokensResponseSchema;

export const LoginDwbnRequest = {
	body: Schema.struct({
		code: Schema.compose(Schema.Trim, Schema.NonEmpty),
		idTelegramChat: IdTelegramChatSchema,
	}).pipe(Schema.identifier("LoginDwbnRequestBodySchema")),
};
export type LoginDwbnRequestBody = Schema.Schema.Type<
	typeof LoginDwbnRequest.body
>;

export const LoginDwbnResponse = Schema.struct({
	credentials: TokensResponseSchema,
	idUser: IdUserSchema,
});
