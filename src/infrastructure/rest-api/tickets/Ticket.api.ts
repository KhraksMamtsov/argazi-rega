import * as Schema from "@effect/schema/Schema";

import { IdTransportOnEventSchema } from "../../../domain/entities/transport-on-event/IdTransportOnEvent.js";
import { IdEventSchema } from "../../../domain/event/entity/IdEvent.js";
import { IdTicketSchema } from "../../../domain/ticket/entity/IdTicket.js";
import { TicketRole } from "../../../domain/ticket/entity/TicketRole.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { TicketBase } from "../../../domain/ticket/entity/Ticket.js";

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
