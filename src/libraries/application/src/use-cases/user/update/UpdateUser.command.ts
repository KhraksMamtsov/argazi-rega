import { Schema } from "@effect/schema";

import {
	IdDwbnSchema,
	IdTelegramChatSchema,
	IdUserSchema,
	UserTypeSchema,
	type User,
	type UserBase,
	type UserType,
} from "@argazi/domain";
import { _SS, _EH } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

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
	_SS.satisfies.from.json<UpdateUserCommandPayloadFrom>(),
	_SS.satisfies.to<
		_EH.Optionize<Omit<UserBase, "id" | "phone" | "lastName">> &
			Pick<User, "id" | "phone" | "lastName">
	>()
);

export const _UpdateUserCommandSchema = BaseCausedCommandFor(
	UpdateUserCommandPayloadSchema
).pipe(Schema.identifier("UpdateUserCommandSchema"));

export interface UpdateUserCommandFrom
	extends Schema.Schema.Encoded<typeof _UpdateUserCommandSchema> {}
export interface UpdateUserCommand
	extends Schema.Schema.Type<typeof _UpdateUserCommandSchema> {}

export const UpdateUserCommandSchema: Schema.Schema<
	UpdateUserCommand,
	UpdateUserCommandFrom
> = _UpdateUserCommandSchema;
