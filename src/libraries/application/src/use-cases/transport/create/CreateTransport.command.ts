import { Schema } from "effect";

import { TransportDb } from "@argazi/database";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export class CreateTransportCommandPayload extends TransportDb.pipe(
  Schema.pick("idUser", "number", "model", "color", "seatsNumber")
).annotations({
  identifier: "CreateTransportCommandPayload",
}) {}

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
