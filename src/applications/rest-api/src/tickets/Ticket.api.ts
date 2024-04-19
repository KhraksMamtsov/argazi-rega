import * as Schema from "@effect/schema/Schema";

import { IdTransportOnEventSchema } from "@argazi/domain";
import { IdEventSchema } from "@argazi/domain";
import { IdTicketSchema } from "@argazi/domain";
import { TicketRole } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import type { TicketBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region TicketApi
const _TicketApiSchema = Schema.Struct({
  dateRegistered: Schema.Date,
  id: IdTicketSchema,
  idEvent: IdEventSchema,
  idTransport: Schema.OptionFromNullOr(IdTransportOnEventSchema),
  idUser: IdUserSchema,
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
  Schema.identifier("TicketApiSchema")
);

export type TicketApiContext = Schema.Schema.Context<typeof _TicketApiSchema>;
export interface TicketApiEncoded
  extends Schema.Schema.Encoded<typeof _TicketApiSchema> {}
export interface TicketApi
  extends Schema.Schema.Type<typeof _TicketApiSchema> {}

export const TicketApiSchema: Schema.Schema<TicketApi, TicketApiEncoded> =
  _TicketApiSchema;
// #endregion TicketApiSchema
