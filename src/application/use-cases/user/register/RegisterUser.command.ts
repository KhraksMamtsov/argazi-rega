import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../../domain/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { UserType } from "../../../../domain/user/entity/UserType.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCommandFor } from "../../common/Base.command.js";

import type { UserBase } from "../../../../domain/user/entity/User.js";

export const RegisterUserCommandPayloadSchema = Schema.struct({
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
	satisfies.from.json(),
	satisfies.to<UserBase>(),
	Schema.identifier("RegisterUserCommandPayloadSchema")
);

export const RegisterUserCommandSchema = BaseCommandFor(
	RegisterUserCommandPayloadSchema
).pipe(Schema.identifier("RegisterUserCommandSchema"));
