import { Schema } from "@effect/schema";

import { TicketDbBaseSchema } from "../../../../infrastructure/database/entity/Ticket.db.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateTicketCommandPayloadSchema = TicketDbBaseSchema.pipe(
	Schema.omit("dateRegistered"),
	Schema.extend(
		Schema.struct({
			dateRegistered: Schema.Date,
		})
	),
	satisfies.from.json(),
	Schema.identifier("CreateTicketCommandPayloadSchema")
);

export const CreateTicketCommandSchema = BaseCausedCommandFor(
	CreateTicketCommandPayloadSchema
).pipe(Schema.identifier("CreateTicketCommandSchema"));
