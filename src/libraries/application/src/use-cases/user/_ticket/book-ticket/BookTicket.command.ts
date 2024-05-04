import { Schema } from "@effect/schema";

import { TicketBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const BookTicketCommandPayload = TicketBase.pipe(
  Schema.pick("idUser", "idEvent"),
  _SS.satisfies.encoded.json(),
  Schema.identifier("BookTicketCommandPayload")
);

// #region BookTicketCommand
const _BookTicketCommand = BaseCausedCommandFor(BookTicketCommandPayload).pipe(
  Schema.identifier("BookTicketCommand")
);

export type BookTicketCommandContext = Schema.Schema.Context<
  typeof _BookTicketCommand
>;
export interface BookTicketCommandEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketCommand> {}
export interface BookTicketCommand
  extends Schema.Schema.Type<typeof _BookTicketCommand> {}

export const BookTicketCommand: Schema.Schema<
  BookTicketCommand,
  BookTicketCommandEncoded
> = _BookTicketCommand;
// #endregion BookTicketCommand
