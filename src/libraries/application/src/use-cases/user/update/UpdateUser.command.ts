import { Schema } from "@effect/schema";

import {
  IdDwbn,
  IdTelegramChat,
  IdUser,
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

export const UpdateUserCommandPayload = Schema.Struct({
  email: Schema.optional(Schema.Secret, {
    as: "Option",
    exact: true,
  }),
  firstName: Schema.optional(Schema.Secret, {
    as: "Option",
    exact: true,
  }),
  idDwbn: Schema.optional(IdDwbn, {
    as: "Option",
    exact: true,
  }),
  idTelegramChat: Schema.optional(IdTelegramChat, {
    as: "Option",
    exact: true,
  }),
  isAdmin: Schema.optional(Schema.Boolean, {
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
    Schema.Struct({
      id: IdUser,
    })
  ),
  Schema.identifier("UpdateUserCommandPayload"),
  _SS.satisfies.encoded.json<UpdateUserCommandPayloadFrom>(),
  _SS.satisfies.type<
    _EH.Optionize<Omit<UserBase, "id" | "phone" | "lastName">> &
      Pick<User, "id" | "phone" | "lastName">
  >()
);

export const _UpdateUserCommand = BaseCausedCommandFor(
  UpdateUserCommandPayload
).pipe(Schema.identifier("UpdateUserCommand"));

export interface UpdateUserCommandFrom
  extends Schema.Schema.Encoded<typeof _UpdateUserCommand> {}
export interface UpdateUserCommand
  extends Schema.Schema.Type<typeof _UpdateUserCommand> {}

export const UpdateUserCommand: Schema.Schema<
  UpdateUserCommand,
  UpdateUserCommandFrom
> = _UpdateUserCommand;
