import * as Schema from "@effect/schema/Schema";

import { IdDwbnSchema } from "../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../domain/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { UserTypeSchema } from "../../../domain/user/entity/UserType.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { UserBase } from "../../../domain/user/entity/User.js";

export const _UserApi = Schema.struct({
	email: Schema.Secret,
	firstName: Schema.Secret,
	id: IdUserSchema,
	idDwbn: IdDwbnSchema,
	idTelegramChat: IdTelegramChatSchema,
	isAdmin: Schema.boolean,
	lastName: Schema.optionFromNullable(Schema.Secret),
	phone: Schema.optionFromNullable(Schema.Secret),
	type: UserTypeSchema,
}).pipe(
	satisfies.from.json(),
	satisfies.to<UserBase>(),
	Schema.identifier("UserApi")
);

export interface UserApiFrom extends Schema.Schema.Encoded<typeof _UserApi> {}
export interface UserApi extends Schema.Schema.Type<typeof _UserApi> {}

export const UserApi: Schema.Schema<UserApi, UserApiFrom> = _UserApi;
