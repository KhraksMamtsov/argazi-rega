import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";
import { TicketBaseSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const ReturnTicketCommandPayloadSchema = TicketBaseSchema.pipe(
	Schema.pick("id", "idUser"),
	_SS.satisfies.from.json(),
	Schema.identifier("ReturnTicketCommandPayloadSchema")
);

export const ReturnTicketCommandSchema = BaseCausedCommandFor(
	ReturnTicketCommandPayloadSchema
).pipe(Schema.identifier("ReturnTicketCommandSchema"));