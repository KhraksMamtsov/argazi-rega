import { Schema } from "@effect/schema";

import { VisitorDataSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const DeleteUsersVisitorCommandPayloadSchema = VisitorDataSchema.pipe(
  Schema.pick("id", "idUser"),
  _SS.satisfies.encoded.json(),
  Schema.identifier("DeleteUsersVisitorCommandPayloadSchema")
);

export const DeleteUsersVisitorCommandSchema = BaseCausedCommandFor(
  DeleteUsersVisitorCommandPayloadSchema
).pipe(Schema.identifier("DeleteUsersVisitorCommandSchema"));
