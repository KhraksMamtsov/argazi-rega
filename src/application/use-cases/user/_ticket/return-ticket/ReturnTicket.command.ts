import { Schema } from "@effect/schema";

import { TicketBaseSchema } from "../../../../../domain/ticket/entity/Ticket.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const ReturnTicketCommandPayloadSchema = TicketBaseSchema.pipe(
	Schema.pick("id", "idUser"),
	satisfies.from.json(),
	Schema.identifier("ReturnTicketCommandPayloadSchema")
);

export const ReturnTicketCommandSchema = BaseCausedCommandFor(
	ReturnTicketCommandPayloadSchema
).pipe(Schema.identifier("ReturnTicketCommandSchema"));
