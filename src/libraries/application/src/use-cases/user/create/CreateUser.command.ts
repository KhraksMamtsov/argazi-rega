import { Schema } from "@effect/schema";

import { IdDwbnSchema, IdTelegramChatSchema } from "@argazi/domain";
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

export const CreateUserCommandPayloadSchema = Schema.Struct({
  email: Schema.Trim,
  firstName: Schema.Trim,
  idDwbn: IdDwbnSchema,
  idTelegramChat: IdTelegramChatSchema,
  lastName: Schema.NullOr(Schema.String),
  phone: Schema.NullOr(Schema.String),
  type: Schema.Literal("ADULT", "STUDENT", "PENSIONER"),
}).pipe(
  _SS.satisfies.from.json<CreateUserCommandPayloadFrom>(),
  Schema.identifier("CreateUserCommandPayloadSchema")
);

export const CreateUserCommandSchema = BaseCausedCommandFor(
  CreateUserCommandPayloadSchema
).pipe(Schema.identifier("CreateUserCommandSchema"));
