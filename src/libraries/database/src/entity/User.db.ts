import { Schema } from "@effect/schema";
import { type User as _User } from "@prisma/client";
import { Effect } from "effect";

import {
  IdDwbnSchema,
  IdTelegramChatSchema,
  IdUserSchema,
  type User,
  UserSchema,
  UserType,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

// #region UserDbSchema
const _UserDbSchema = Schema.Struct({
  email: Schema.Secret,
  firstName: Schema.Secret,
  id: IdUserSchema,
  idDwbn: IdDwbnSchema,
  idTelegramChat: IdTelegramChatSchema,
  isAdmin: Schema.Boolean,
  lastName: Schema.OptionFromNullOr(Schema.Secret),
  phone: Schema.OptionFromNullOr(Schema.Secret),
  type: Schema.transformLiterals(
    ["ADULT", UserType.ADULT],
    ["STUDENT", UserType.STUDENT],
    ["PENSIONER", UserType.PENSIONER]
  ),
}).pipe(
  Schema.extend(BaseDbSchema),
  Schema.identifier("UserDbSchema"),
  _SS.satisfies.from<_User>()
);

export type UserDbContext = Schema.Schema.Context<typeof _UserDbSchema>;
export interface UserDbEncoded
  extends Schema.Schema.Encoded<typeof _UserDbSchema> {}
export interface UserDb extends Schema.Schema.Type<typeof _UserDbSchema> {}

export const UserDbSchema: Schema.Schema<UserDb, UserDbEncoded> = _UserDbSchema;
// #endregion UserDbSchema

export const UserDbToDomainSchema: Schema.Schema<User, _User> = transform(
  UserDbSchema,
  UserSchema,
  Effect.succeed,
  (x) => Effect.succeed(x)
);
