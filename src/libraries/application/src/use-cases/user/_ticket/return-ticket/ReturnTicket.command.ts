import { Schema } from "@effect/schema";

import { TicketBaseSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const ReturnTicketCommandPayloadSchema = TicketBaseSchema.pipe(
  Schema.pick("id", "idUser"),
  _SS.satisfies.encoded.json(),
  Schema.identifier("ReturnTicketCommandPayloadSchema")
);

export const ReturnTicketCommandSchema = BaseCausedCommandFor(
  ReturnTicketCommandPayloadSchema
).pipe(Schema.identifier("ReturnTicketCommandSchema"));
