import * as Schema from "@effect/schema/Schema";

import { IdDwbnSchema } from "@argazi/domain";
import { IdTelegramChatSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import { UserTypeSchema } from "@argazi/domain";
import type { UserBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _UserApi = Schema.Struct({
  email: Schema.Secret,
  firstName: Schema.Secret,
  id: IdUserSchema,
  idDwbn: IdDwbnSchema,
  idTelegramChat: IdTelegramChatSchema,
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
