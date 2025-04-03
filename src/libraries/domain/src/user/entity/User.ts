import { Schema } from "effect";

import { IdDwbn } from "./IdDwbn.js";
import { IdTelegramChat } from "./IdTelegramChat.js";
import { IdUser } from "./IdUser.js";
import { UserTypeSchema } from "./UserType.js";

import { Base } from "../../entities/common/Base.js";

export const UserBase = Schema.Struct({
  //
  email: Schema.RedactedFromSelf(Schema.String),
  firstName: Schema.RedactedFromSelf(Schema.String),
  id: IdUser,
  idDwbn: IdDwbn,
  idTelegramChat: IdTelegramChat,
  isAdmin: Schema.Boolean,
  lastName: Schema.OptionFromSelf(Schema.RedactedFromSelf(Schema.String)),
  phone: Schema.OptionFromSelf(Schema.RedactedFromSelf(Schema.String)),
  type: UserTypeSchema,
}).pipe(Schema.annotations({ identifier: "UserBase" }));

export interface UserBase extends Schema.Schema.Type<typeof UserBase> {}

const _User = UserBase.pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "User" })
);

export interface User extends Schema.Schema.Type<typeof _User> {}

export const User: Schema.Schema<User> = Schema.typeSchema(_User);
