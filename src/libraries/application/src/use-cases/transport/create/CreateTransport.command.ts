import { Schema } from "@effect/schema";

import { TransportDb } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

// #region CreateTransportCommandPayload
const _CreateTransportCommandPayload = TransportDb.pipe(
  Schema.pick("idUser", "number", "model", "color", "seatsNumber"),
  Schema.annotations({ identifier: "CreateTransportCommandPayload" })
).pipe(_SS.satisfies.encoded.json());

export type CreateTransportCommandPayloadContext = Schema.Schema.Context<
  typeof _CreateTransportCommandPayload
>;
export interface CreateTransportCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportCommandPayload> {}
export interface CreateTransportCommandPayload
  extends Schema.Schema.Type<typeof _CreateTransportCommandPayload> {}

export const CreateTransportCommandPayload: Schema.Schema<
  CreateTransportCommandPayload,
  CreateTransportCommandPayloadEncoded
> = _CreateTransportCommandPayload;
// #endregion CreateTransportCommandPayload

// #region CreateTransportCommand
const _CreateTransportCommand = BaseCausedCommandFor(
  CreateTransportCommandPayload
).pipe(Schema.annotations({ identifier: "CreateTransportCommand" }));

export type CreateTransportCommandContext = Schema.Schema.Context<
  typeof _CreateTransportCommand
>;
export interface CreateTransportCommandEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportCommand> {}
export interface CreateTransportCommand
  extends Schema.Schema.Type<typeof _CreateTransportCommand> {}

export const CreateTransportCommand: Schema.Schema<
  CreateTransportCommand,
  CreateTransportCommandEncoded
> = _CreateTransportCommand;
// #endregion CreateTransportCommand
