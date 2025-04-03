import { Schema } from "effect";

import { IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketsCommandPayload = Schema.Struct({
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetUserTicketsCommandPayload" })
);

export type GetUserTicketsCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserTicketsCommandPayload
>;

export const GetUserTicketsCommand = BaseCausedCommandFor(
  GetUserTicketsCommandPayload
).pipe(Schema.annotations({ identifier: "GetUserTicketsCommand" }));
