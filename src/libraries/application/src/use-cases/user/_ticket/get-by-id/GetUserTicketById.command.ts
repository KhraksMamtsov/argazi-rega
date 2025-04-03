import { Schema } from "effect";

import { IdTicket, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserTicketByIdCommandPayload = Schema.Struct({
  idTicket: IdTicket,
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetUserTicketByIdCommandPayload" })
);

export type GetUserTicketByIdCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserTicketByIdCommandPayload
>;

export const GetUserTicketByIdCommand = BaseCausedCommandFor(
  GetUserTicketByIdCommandPayload
).pipe(Schema.annotations({ identifier: "GetUserTicketByIdCommand" }));
