import { Schema } from "@effect/schema";

import { VisitorData } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const DeleteUsersVisitorCommandPayload = VisitorData.pipe(
  Schema.pick("id", "idUser"),
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "DeleteUsersVisitorCommandPayload" })
);

export const DeleteUsersVisitorCommand = BaseCausedCommandFor(
  DeleteUsersVisitorCommandPayload
).pipe(Schema.annotations({ identifier: "DeleteUsersVisitorCommand" }));
