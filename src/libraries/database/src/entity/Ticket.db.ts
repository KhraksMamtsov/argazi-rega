import { Schema } from "effect";
import { type Ticket as _Ticket } from "@prisma/client";
import { Effect } from "effect";

import { IdTransportOnEvent } from "@argazi/domain";
import { IdEvent } from "@argazi/domain";
import { IdTicket } from "@argazi/domain";
import { type TicketBase, Ticket } from "@argazi/domain";
import { TicketRole } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

export const TicketDbBase = Schema.Struct({
  dateRegistered: Schema.ValidDateFromSelf,
  id: IdTicket,
  idEvent: IdEvent,
  idTransport: Schema.OptionFromNullOr(IdTransportOnEvent),
  idUser: IdUser,
  role: Schema.transformLiterals(
    ["ADMIN", TicketRole.ADMIN],
    ["CASHIER", TicketRole.CASHIER],
    ["LEAD", TicketRole.LEAD],
    ["NONE", TicketRole.NONE],
    ["CHIEF", TicketRole.CHIEF]
  ),
}).pipe(Schema.annotations({ identifier: "TicketDbBase" }));

// #region TicketDb
const _TicketDb = TicketDbBase.pipe(
  _SS.satisfies.type<TicketBase>(),
  Schema.extend(BaseDb),
  _SS.satisfies.encoded<_Ticket>(),
  Schema.annotations({ identifier: "_TicketDb" })
);

export type TicketDbContext = Schema.Schema.Context<typeof _TicketDb>;
export interface TicketDbEncoded
  extends Schema.Schema.Encoded<typeof _TicketDb> {}
export interface TicketDb extends Schema.Schema.Type<typeof _TicketDb> {}

export const TicketDb: Schema.Schema<TicketDb, TicketDbEncoded> = _TicketDb;
// #endregion TicketDb

export const TicketDbToDomain = transform(
  TicketDb,
  Ticket,
  Effect.succeed,
  Effect.succeed
);
