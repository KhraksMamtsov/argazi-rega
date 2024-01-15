import { Schema } from "@effect/schema";

import { TicketBaseSchema } from "../../../../../domain/ticket/entity/Ticket.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const BookTicketCommandPayloadSchema = TicketBaseSchema.pipe(
	Schema.pick("idUser", "idEvent"),
	satisfies.from.json(),
	Schema.identifier("BookTicketCommandPayloadSchema")
);

export const BookTicketCommandSchema = BaseCausedCommandFor(
	BookTicketCommandPayloadSchema
).pipe(Schema.identifier("BookTicketCommandSchema"));
