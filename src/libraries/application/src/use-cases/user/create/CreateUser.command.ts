import { Schema } from "@effect/schema";

import { IdDwbn, IdTelegramChat } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreateUserCommandPayloadFrom = {
  readonly email: string;
  readonly firstName: string;
  readonly idDwbn: string;
  readonly idTelegramChat: number;
  readonly lastName: string | null;
  readonly phone: string | null;
  readonly type: "ADULT" | "STUDENT" | "PENSIONER";
};

export const CreateUserCommandPayload = Schema.Struct({
  email: Schema.Trim,
  firstName: Schema.Trim,
  idDwbn: IdDwbn,
  idTelegramChat: IdTelegramChat,
  lastName: Schema.NullOr(Schema.String),
  phone: Schema.NullOr(Schema.String),
  type: Schema.Literal("ADULT", "STUDENT", "PENSIONER"),
}).pipe(
  _SS.satisfies.encoded.json<CreateUserCommandPayloadFrom>(),
  Schema.annotations({ identifier: "CreateUserCommandPayload" })
);

export const CreateUserCommand = BaseCausedCommandFor(
  CreateUserCommandPayload
).pipe(Schema.annotations({ identifier: "CreateUserCommand" }));
