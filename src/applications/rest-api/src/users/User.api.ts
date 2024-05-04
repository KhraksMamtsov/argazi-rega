import * as Schema from "@effect/schema/Schema";

import { IdDwbn } from "@argazi/domain";
import { IdTelegramChat } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import { UserTypeSchema } from "@argazi/domain";
import type { UserBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _UserApi = Schema.Struct({
  email: Schema.Secret,
  firstName: Schema.Secret,
  id: IdUser,
  idDwbn: IdDwbn,
  idTelegramChat: IdTelegramChat,
  isAdmin: Schema.Boolean,
  lastName: Schema.OptionFromNullOr(Schema.Secret),
  phone: Schema.OptionFromNullOr(Schema.Secret),
  type: UserTypeSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<UserBase>(),
  Schema.identifier("UserApi")
);

export interface UserApiFrom extends Schema.Schema.Encoded<typeof _UserApi> {}
export interface UserApi extends Schema.Schema.Type<typeof _UserApi> {}

export const UserApi: Schema.Schema<UserApi, UserApiFrom> = _UserApi;
