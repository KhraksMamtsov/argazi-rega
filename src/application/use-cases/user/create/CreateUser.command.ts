import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../../domain/user/entity/IdTelegramChat.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

import type { UserType } from "@prisma/client";

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
	satisfies.from.json<CreateUserCommandPayloadFrom>(),
	Schema.identifier("CreateUserCommandPayloadSchema")
);

export const CreateUserCommandSchema = BaseCausedCommandFor(
	CreateUserCommandPayloadSchema
).pipe(Schema.identifier("CreateUserCommandSchema"));
