import { Schema } from "@effect/schema";
import { type Ticket as _Ticket } from "@prisma/client";
import { Effect } from "effect";

import { IdTransportOnEventSchema } from "../../../domain/entities/transport-on-event/IdTransportOnEvent.js";
import { IdEventSchema } from "../../../domain/event/entity/IdEvent.js";
import { IdTicketSchema } from "../../../domain/ticket/entity/IdTicket.js";
import {
	type TicketBase,
	TicketSchema,
} from "../../../domain/ticket/entity/Ticket.js";
import { TicketRole } from "../../../domain/ticket/entity/TicketRole.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

export const TicketDbBaseSchema = Schema.struct({
	dateRegistered: Schema.ValidDateFromSelf,
	id: IdTicketSchema,
	idEvent: IdEventSchema,
	idTransport: Schema.optionFromNullable(IdTransportOnEventSchema),
	idUser: IdUserSchema,
	role: Schema.transformLiterals(
		["ADMIN", TicketRole.ADMIN],
		["CASHIER", TicketRole.CASHIER],
		["LEAD", TicketRole.LEAD],
		["NONE", TicketRole.NONE],
		["CHIEF", TicketRole.CHIEF]
	),
}).pipe(Schema.identifier("TicketDbBaseSchema"));

export const TicketDbSchema = TicketDbBaseSchema.pipe(
	satisfies.to<TicketBase>(),
	Schema.extend(BaseDbSchema),
	satisfies.from<_Ticket>()
);

export const ToDomainSchema = transform(
	TicketDbSchema,
	TicketSchema,
	Effect.succeed,
	Effect.succeed
);
