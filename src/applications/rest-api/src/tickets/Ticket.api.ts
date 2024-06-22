import * as Schema from "@effect/schema/Schema";

import { IdTransportOnEvent } from "@argazi/domain";
import { IdEvent } from "@argazi/domain";
import { IdTicket } from "@argazi/domain";
import { TicketRole } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import type { TicketBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region TicketApi
const _TicketApi = Schema.Struct({
  dateRegistered: Schema.Date,
  id: IdTicket,
  idEvent: IdEvent,
  idTransport: Schema.OptionFromNullOr(IdTransportOnEvent),
  idUser: IdUser,
  role: Schema.transformLiterals(
    ["ADMIN", TicketRole.ADMIN],
    ["LEAD", TicketRole.LEAD],
    ["CHIEF", TicketRole.CHIEF],
    ["CASHIER", TicketRole.CASHIER],
    ["NONE", TicketRole.NONE]
  ),
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<TicketBase>(),
  Schema.annotations({ identifier: "TicketApi" })
);

export type TicketApiContext = Schema.Schema.Context<typeof _TicketApi>;
export interface TicketApiEncoded
  extends Schema.Schema.Encoded<typeof _TicketApi> {}
export interface TicketApi extends Schema.Schema.Type<typeof _TicketApi> {}

export const TicketApi: Schema.Schema<TicketApi, TicketApiEncoded> = _TicketApi;
// #endregion TicketApi
