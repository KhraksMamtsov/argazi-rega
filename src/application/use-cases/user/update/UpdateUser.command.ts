import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../../domain/user/entity/IdTelegramChat.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import {
	type User,
	type UserBase,
} from "../../../../domain/user/entity/User.js";
import {
	UserType,
	UserTypeSchema,
} from "../../../../domain/user/entity/UserType.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

import type { Optionize } from "../../../../libs/EffectHttp.js";

export type UpdateUserCommandPayloadFrom = {
	readonly email?: string;
	readonly firstName?: string;
	readonly id: string;
	readonly idTelegramChat?: number;
	readonly isAdmin?: boolean;
	readonly lastName?: string | null;
	readonly phone?: string | null;
	readonly type?: UserType;
};

export const UpdateUserCommandPayloadSchema = Schema.struct({
	email: Schema.optional(Schema.Secret, {
		as: "Option",
		exact: true,
	}),
	firstName: Schema.optional(Schema.Secret, {
		as: "Option",
		exact: true,
	}),
	idDwbn: Schema.optional(IdDwbnSchema, {
		as: "Option",
		exact: true,
	}),
	idTelegramChat: Schema.optional(IdTelegramChatSchema, {
		as: "Option",
		exact: true,
	}),
	isAdmin: Schema.optional(Schema.boolean, {
		as: "Option",
		exact: true,
	}),
	lastName: Schema.optional(Schema.Secret, {
		as: "Option",
		exact: true,
		nullable: true,
	}),
	phone: Schema.optional(Schema.Secret, {
		as: "Option",
		exact: true,
		nullable: true,
	}),
	type: Schema.optional(UserTypeSchema, {
		as: "Option",
		exact: true,
	}),
}).pipe(
	Schema.extend(
		Schema.struct({
			id: IdUserSchema,
		})
	),
	Schema.identifier("UpdateUserCommandPayloadSchema"),
	satisfies.from.json<UpdateUserCommandPayloadFrom>(),
	satisfies.to<
		Optionize<Omit<UserBase, "id" | "phone" | "lastName">> &
			Pick<User, "id" | "phone" | "lastName">
	>()
);

export const _UpdateUserCommandSchema = BaseCausedCommandFor(
	UpdateUserCommandPayloadSchema
).pipe(Schema.identifier("UpdateUserCommandSchema"));

export type UpdateUserCommandFrom = Schema.Schema.From<
	typeof _UpdateUserCommandSchema
>;
export type UpdateUserCommand = Schema.Schema.To<
	typeof _UpdateUserCommandSchema
>;

export const UpdateUserCommandSchema: Schema.Schema<
	UpdateUserCommand,
	UpdateUserCommandFrom
> = _UpdateUserCommandSchema;
