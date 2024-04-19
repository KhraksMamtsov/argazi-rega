import { Schema } from "@effect/schema";

import { VisitorDbBaseSchema } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

// #region CreateUsersVisitorCommandPayload
export const _CreateUsersVisitorCommandPayloadSchema = VisitorDbBaseSchema.pipe(
  Schema.omit("id"),
  Schema.identifier("CreateUsersVisitorCommandPayloadSchema"),
  _SS.satisfies.encoded.json()
);

export type CreateUsersVisitorCommandPayloadContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorCommandPayloadSchema
>;
export interface CreateUsersVisitorCommandPayloadEncoded
  extends Schema.Schema.Encoded<
    typeof _CreateUsersVisitorCommandPayloadSchema
  > {}
export interface CreateUsersVisitorCommandPayload
  extends Schema.Schema.Type<typeof _CreateUsersVisitorCommandPayloadSchema> {}

export const CreateUsersVisitorCommandPayloadSchema: Schema.Schema<
  CreateUsersVisitorCommandPayload,
  CreateUsersVisitorCommandPayloadEncoded
> = _CreateUsersVisitorCommandPayloadSchema;
// #endregion CreateUsersVisitorCommandPayloadSchema

// #region CreateUsersVisitorCommand
export const _CreateUsersVisitorCommandSchema = BaseCausedCommandFor(
  CreateUsersVisitorCommandPayloadSchema
).pipe(Schema.identifier("CreateUsersVisitorCommandSchema"));

export type CreateUsersVisitorCommandContext = Schema.Schema.Context<
  typeof _CreateUsersVisitorCommandSchema
>;
export interface CreateUsersVisitorCommandEncoded
  extends Schema.Schema.Encoded<typeof _CreateUsersVisitorCommandSchema> {}
export interface CreateUsersVisitorCommand
  extends Schema.Schema.Type<typeof _CreateUsersVisitorCommandSchema> {}

export const CreateUsersVisitorCommandSchema: Schema.Schema<
  CreateUsersVisitorCommand,
  CreateUsersVisitorCommandEncoded
> = _CreateUsersVisitorCommandSchema;
// #endregion CreateUsersVisitorCommandSchema
