import { Schema } from "@effect/schema";

import {
	IdDwbnSchema,
	IdTelegramChatSchema,
	IdUserSchema,
	UserType,
	type UserBase,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCommandFor } from "../../common/Base.command.js";

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
	_SS.satisfies.from.json(),
	_SS.satisfies.to<UserBase>(),
	Schema.identifier("RegisterUserCommandPayloadSchema")
);

export const RegisterUserCommandSchema = BaseCommandFor(
	RegisterUserCommandPayloadSchema
).pipe(Schema.identifier("RegisterUserCommandSchema"));
