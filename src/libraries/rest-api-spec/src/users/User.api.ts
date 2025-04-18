import { Schema } from "effect";

import { IdDwbn } from "@argazi/domain";
import { IdTelegramChat } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import { UserTypeSchema } from "@argazi/domain";
import type { UserBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _UserApi = Schema.Struct({
  email: Schema.Redacted(Schema.String),
  firstName: Schema.Redacted(Schema.String),
  id: IdUser,
  idDwbn: IdDwbn,
  idTelegramChat: IdTelegramChat,
  isAdmin: Schema.Boolean,
  lastName: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  phone: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  type: UserTypeSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<UserBase>(),
  Schema.annotations({ identifier: "UserApi" })
);

export interface UserApiFrom extends Schema.Schema.Encoded<typeof _UserApi> {}
export interface UserApi extends Schema.Schema.Type<typeof _UserApi> {}

export const UserApi: Schema.Schema<UserApi, UserApiFrom> = _UserApi;
