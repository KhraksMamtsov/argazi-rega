import { Schema } from "@effect/schema";

import { TicketBaseSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const BookTicketCommandPayloadSchema = TicketBaseSchema.pipe(
  Schema.pick("idUser", "idEvent"),
  _SS.satisfies.encoded.json(),
  Schema.identifier("BookTicketCommandPayloadSchema")
);

// #region BookTicketCommand
const _BookTicketCommandSchema = BaseCausedCommandFor(
  BookTicketCommandPayloadSchema
).pipe(Schema.identifier("BookTicketCommandSchema"));

export type BookTicketCommandContext = Schema.Schema.Context<
  typeof _BookTicketCommandSchema
>;
export interface BookTicketCommandEncoded
  extends Schema.Schema.Encoded<typeof _BookTicketCommandSchema> {}
export interface BookTicketCommand
  extends Schema.Schema.Type<typeof _BookTicketCommandSchema> {}

export const BookTicketCommandSchema: Schema.Schema<
  BookTicketCommand,
  BookTicketCommandEncoded
> = _BookTicketCommandSchema;
// #endregion BookTicketCommandSchema
