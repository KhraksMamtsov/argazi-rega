import { Schema } from "effect";
import { type User as _User } from "@prisma/client";
import { Effect } from "effect";

import { IdDwbn, IdTelegramChat, IdUser, User, UserType } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

// #region UserDb
const _UserDb = Schema.Struct({
  email: Schema.Redacted(Schema.String),
  firstName: Schema.Redacted(Schema.String),
  id: IdUser,
  idDwbn: IdDwbn,
  idTelegramChat: IdTelegramChat,
  isAdmin: Schema.Boolean,
  lastName: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  phone: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  type: Schema.transformLiterals(
    ["ADULT", UserType.ADULT],
    ["STUDENT", UserType.STUDENT],
    ["PENSIONER", UserType.PENSIONER]
  ),
}).pipe(
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "UserDb" }),
  _SS.satisfies.encoded<_User>()
);

export type UserDbContext = Schema.Schema.Context<typeof _UserDb>;
export interface UserDbEncoded extends Schema.Schema.Encoded<typeof _UserDb> {}
export interface UserDb extends Schema.Schema.Type<typeof _UserDb> {}

export const UserDb: Schema.Schema<UserDb, UserDbEncoded> = _UserDb;
// #endregion UserDb

export const UserDbToDomain: Schema.Schema<User, _User> = transform(
  UserDb,
  User,
  Effect.succeed,
  (x) => Effect.succeed(x)
);
