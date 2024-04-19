import { Schema } from "@effect/schema";

import { TransportDbSchema } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

// #region CreateTransportCommandPayload
const _CreateTransportCommandPayloadSchema = TransportDbSchema.pipe(
  Schema.pick("idUser", "number", "model", "color", "seatsNumber"),
  Schema.identifier("CreateTransportCommandPayloadSchema")
).pipe(_SS.satisfies.encoded.json());

export type CreateTransportCommandPayloadContext = Schema.Schema.Context<
  typeof _CreateTransportCommandPayloadSchema
>;
export interface CreateTransportCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportCommandPayloadSchema> {}
export interface CreateTransportCommandPayload
  extends Schema.Schema.Type<typeof _CreateTransportCommandPayloadSchema> {}

export const CreateTransportCommandPayloadSchema: Schema.Schema<
  CreateTransportCommandPayload,
  CreateTransportCommandPayloadEncoded
> = _CreateTransportCommandPayloadSchema;
// #endregion CreateTransportCommandPayloadSchema

// #region CreateTransportCommand
const _CreateTransportCommandSchema = BaseCausedCommandFor(
  CreateTransportCommandPayloadSchema
).pipe(Schema.identifier("CreateTransportCommandSchema"));

export type CreateTransportCommandContext = Schema.Schema.Context<
  typeof _CreateTransportCommandSchema
>;
export interface CreateTransportCommandEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportCommandSchema> {}
export interface CreateTransportCommand
  extends Schema.Schema.Type<typeof _CreateTransportCommandSchema> {}

export const CreateTransportCommandSchema: Schema.Schema<
  CreateTransportCommand,
  CreateTransportCommandEncoded
> = _CreateTransportCommandSchema;
// #endregion CreateTransportCommandSchema
