import { Schema } from "@effect/schema";

import { TicketDbBaseSchema } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateTicketCommandPayloadSchema = TicketDbBaseSchema.pipe(
  Schema.omit("dateRegistered"),
  Schema.extend(
    Schema.Struct({
      dateRegistered: Schema.Date,
    })
  ),
  _SS.satisfies.encoded.json(),
  Schema.identifier("CreateTicketCommandPayloadSchema")
);

export const CreateTicketCommandSchema = BaseCausedCommandFor(
  CreateTicketCommandPayloadSchema
).pipe(Schema.identifier("CreateTicketCommandSchema"));
