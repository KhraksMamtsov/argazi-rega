import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

import type { UserType } from "@prisma/client";
import { IdDwbnSchema, IdTelegramChatSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export type CreateUserCommandPayloadFrom = {
	readonly email: string;
	readonly firstName: string;
	readonly idDwbn: string;
	readonly idTelegramChat: number;
	readonly lastName: string | null;
	readonly phone: string | null;
	readonly type: UserType;
};

export const CreateUserCommandPayloadSchema = Schema.struct({
	email: Schema.Trim,
	firstName: Schema.Trim,
	idDwbn: IdDwbnSchema,
	idTelegramChat: IdTelegramChatSchema,
	lastName: Schema.nullable(Schema.string),
	phone: Schema.nullable(Schema.string),
	type: Schema.literal("ADULT", "STUDENT", "PENSIONER"),
}).pipe(
	_SS.satisfies.from.json<CreateUserCommandPayloadFrom>(),
	Schema.identifier("CreateUserCommandPayloadSchema")
);

export const CreateUserCommandSchema = BaseCausedCommandFor(
	CreateUserCommandPayloadSchema
).pipe(Schema.identifier("CreateUserCommandSchema"));
