import { Schema } from "@effect/schema";
import { type User as _User } from "@prisma/client";
import { Effect } from "effect";

import { IdDwbnSchema } from "../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../domain/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { type User, UserSchema } from "../../../domain/user/entity/User.js";
import { UserType } from "../../../domain/user/entity/UserType.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

export interface UserDbFrom extends Readonly<_User> {}

export const UserDbSchema = Schema.struct({
	email: Schema.Secret,
	firstName: Schema.Secret,
	id: IdUserSchema,
	idDwbn: IdDwbnSchema,
	idTelegramChat: IdTelegramChatSchema,
	isAdmin: Schema.boolean,
	lastName: Schema.optionFromNullable(Schema.Secret),
	phone: Schema.optionFromNullable(Schema.Secret),
	type: Schema.transformLiterals(
		["ADULT", UserType.ADULT],
		["STUDENT", UserType.STUDENT],
		["PENSIONER", UserType.PENSIONER]
	),
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("UserDbSchema"),
	satisfies.from<UserDbFrom>()
);

export const ToDomainSchema: Schema.Schema<User, UserDbFrom> = transform(
	UserDbSchema,
	UserSchema,
	Effect.succeed,
	Effect.succeed
);
