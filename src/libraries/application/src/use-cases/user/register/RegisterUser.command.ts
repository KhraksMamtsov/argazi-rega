import { Schema } from "@effect/schema";

import {
  IdDwbn,
  IdTelegramChat,
  IdUser,
  UserType,
  type UserBase,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCommandFor } from "../../common/Base.command.js";

export const RegisterUserCommandPayload = Schema.Struct({
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
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<UserBase>(),
  Schema.identifier("RegisterUserCommandPayload")
);

export const RegisterUserCommand = BaseCommandFor(
  RegisterUserCommandPayload
).pipe(Schema.identifier("RegisterUserCommand"));
