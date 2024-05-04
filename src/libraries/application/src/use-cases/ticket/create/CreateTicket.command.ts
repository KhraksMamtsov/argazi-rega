import { Schema } from "@effect/schema";

import { TicketDbBase } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateTicketCommandPayload = TicketDbBase.pipe(
  Schema.omit("dateRegistered"),
  Schema.extend(
    Schema.Struct({
      dateRegistered: Schema.Date,
    })
  ),
  _SS.satisfies.encoded.json(),
  Schema.identifier("CreateTicketCommandPayload")
);

export const CreateTicketCommand = BaseCausedCommandFor(
  CreateTicketCommandPayload
).pipe(Schema.identifier("CreateTicketCommand"));
