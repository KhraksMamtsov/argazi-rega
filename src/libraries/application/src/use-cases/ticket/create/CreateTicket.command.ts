import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../common/Base.command.js";
import { TicketDbBaseSchema } from "@argazi/database";
import { _SS } from "@argazi/shared";

export const CreateTicketCommandPayloadSchema = TicketDbBaseSchema.pipe(
	Schema.omit("dateRegistered"),
	Schema.extend(
		Schema.struct({
			dateRegistered: Schema.Date,
		})
	),
	_SS.satisfies.from.json(),
	Schema.identifier("CreateTicketCommandPayloadSchema")
);

export const CreateTicketCommandSchema = BaseCausedCommandFor(
	CreateTicketCommandPayloadSchema
).pipe(Schema.identifier("CreateTicketCommandSchema"));
