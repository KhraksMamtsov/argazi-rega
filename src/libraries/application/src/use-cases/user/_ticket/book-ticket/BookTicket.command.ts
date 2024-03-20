import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";
import { TicketBaseSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const BookTicketCommandPayloadSchema = TicketBaseSchema.pipe(
	Schema.pick("idUser", "idEvent"),
	_SS.satisfies.from.json(),
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
