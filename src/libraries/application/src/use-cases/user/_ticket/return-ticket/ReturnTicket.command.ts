import { Schema } from "effect";

import { TicketBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const ReturnTicketCommandPayload = TicketBase.pipe(
  Schema.pick("id", "idUser"),
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "ReturnTicketCommandPayload" })
);

export const ReturnTicketCommand = BaseCausedCommandFor(
  ReturnTicketCommandPayload
).pipe(Schema.annotations({ identifier: "ReturnTicketCommand" }));
