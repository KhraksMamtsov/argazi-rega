import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "./IdDwbn.js";
import { IdTelegramChatSchema } from "./IdTelegramChat.js";
import { IdUserSchema } from "./IdUser.js";
import { UserTypeSchema } from "./UserType.js";

import { BaseSchema } from "../../entities/common/Base.js";

export const UserBaseSchema = Schema.struct({
	//
	email: Schema.SecretFromSelf,
	firstName: Schema.SecretFromSelf,
	id: IdUserSchema,
	idDwbn: IdDwbnSchema,
	idTelegramChat: IdTelegramChatSchema,
	isAdmin: Schema.boolean,
	lastName: Schema.optionFromSelf(Schema.SecretFromSelf),
	phone: Schema.optionFromSelf(Schema.SecretFromSelf),
	type: UserTypeSchema,
}).pipe(Schema.identifier("UserBaseSchema"));

export interface UserBase extends Schema.Schema.To<typeof UserBaseSchema> {}

const _UserSchema = UserBaseSchema.pipe(
	Schema.extend(BaseSchema),
	Schema.identifier("UserSchema")
);

export interface User extends Schema.Schema.To<typeof _UserSchema> {}

export const UserSchema: Schema.Schema<User> = Schema.to(_UserSchema);
