import { Schema } from "@effect/schema";

import { VisitorDbBase } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

// #region CreateUsersVisitorCommandPayload
export const _CreateUsersVisitorCommandPayload = VisitorDbBase.pipe(
  Schema.omit("id"),
  Schema.identifier("CreateUsersVisitorCommandPayload"),
  _SS.satisfies.encoded.json()
);

export type CreateUsersVisitorCommandPayloadContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorCommandPayload
>;
export interface CreateUsersVisitorCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorCommandPayload> {}
export interface CreateUsersVisitorCommandPayload
  extends Schema.Schema.Type<typeof _CreateUsersVisitorCommandPayload> {}

export const CreateUsersVisitorCommandPayload: Schema.Schema<
  CreateUsersVisitorCommandPayload,
  CreateUsersVisitorCommandPayloadEncoded
> = _CreateUsersVisitorCommandPayload;
// #endregion CreateUsersVisitorCommandPayload

// #region CreateUsersVisitorCommand
export const _CreateUsersVisitorCommand = BaseCausedCommandFor(
  CreateUsersVisitorCommandPayload
).pipe(Schema.identifier("CreateUsersVisitorCommand"));

export type CreateUsersVisitorCommandContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorCommand
>;
export interface CreateUsersVisitorCommandEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorCommand> {}
export interface CreateUsersVisitorCommand
  extends Schema.Schema.Type<typeof _CreateUsersVisitorCommand> {}

export const CreateUsersVisitorCommand: Schema.Schema<
  CreateUsersVisitorCommand,
  CreateUsersVisitorCommandEncoded
> = _CreateUsersVisitorCommand;
// #endregion CreateUsersVisitorCommand
