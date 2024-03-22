import { Schema } from "@effect/schema";
import { type User as _User } from "@prisma/client";
import { Effect } from "effect";

import { IdDwbnSchema } from "@argazi/domain";
import { IdTelegramChatSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import { type User, UserSchema } from "@argazi/domain";
import { UserType } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

export interface UserDbFrom extends Readonly<_User> {}

// #region UserDb
const _UserDbSchema = Schema.struct({
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
  _SS.satisfies.from<UserDbFrom>()
);

export type UserDbContext = Schema.Schema.Context<typeof _UserDbSchema>;
export interface UserDbEncoded
  extends Schema.Schema.Encoded<typeof _UserDbSchema> {}
export interface UserDb extends Schema.Schema.Type<typeof _UserDbSchema> {}

export const UserDbSchema: Schema.Schema<UserDb, UserDbEncoded> = _UserDbSchema;
// #endregion UserDbSchema

export const UserDbToDomainSchema: Schema.Schema<User, UserDbFrom> = transform(
  UserDbSchema,
  UserSchema,
  Effect.succeed,
  Effect.succeed
);
