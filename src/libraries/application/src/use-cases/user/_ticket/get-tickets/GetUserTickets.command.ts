import { Schema } from "@effect/schema";

import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketsCommandPayloadSchema = Schema.Struct({
  idUser: IdUserSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("GetUserTicketsCommandPayloadSchema")
);

export type GetUserTicketsCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserTicketsCommandPayloadSchema
>;

export const GetUserTicketsCommandSchema = BaseCausedCommandFor(
  GetUserTicketsCommandPayloadSchema
).pipe(Schema.identifier("GetUserTicketsCommandSchema"));
