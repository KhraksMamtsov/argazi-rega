import * as Schema from "@effect/schema/Schema";

import { IdTransportOnEventSchema } from "../../../libraries/domain/src/entities/transport-on-event/IdTransportOnEvent.js";
import { IdEventSchema } from "../../../libraries/domain/src/event/entity/IdEvent.js";
import { IdTicketSchema } from "../../../libraries/domain/src/ticket/entity/IdTicket.js";
import { TicketRole } from "../../../libraries/domain/src/ticket/entity/TicketRole.js";
import { IdUserSchema } from "../../../libraries/domain/src/user/entity/IdUser.js";
import { _SS } from "@argazi/shared";

import type { TicketBase } from "../../../libraries/domain/src/ticket/entity/Ticket.js";

// #region TicketApi
const _TicketApiSchema = Schema.struct({
	dateRegistered: Schema.Date,
	id: IdTicketSchema,
	idEvent: IdEventSchema,
	idTransport: Schema.optionFromNullable(IdTransportOnEventSchema),
	idUser: IdUserSchema,
	role: Schema.transformLiterals(
		["ADMIN", TicketRole.ADMIN],
		["LEAD", TicketRole.LEAD],
		["CHIEF", TicketRole.CHIEF],
		["CASHIER", TicketRole.CASHIER],
		["NONE", TicketRole.NONE]
	),
}).pipe(
	satisfies.from.json(),
	satisfies.to<TicketBase>(),
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
