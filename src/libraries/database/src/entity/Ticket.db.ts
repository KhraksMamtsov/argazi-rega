import { Schema } from "@effect/schema";
import { type Ticket as _Ticket } from "@prisma/client";
import { Effect } from "effect";

import { IdTransportOnEventSchema } from "@argazi/domain";
import { IdEventSchema } from "@argazi/domain";
import { IdTicketSchema } from "@argazi/domain";
import { type TicketBase, TicketSchema } from "@argazi/domain";
import { TicketRole } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

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

// #region TicketDb
const _TicketDbSchema = TicketDbBaseSchema.pipe(
	_SS.satisfies.to<TicketBase>(),
	Schema.extend(BaseDbSchema),
	_SS.satisfies.from<_Ticket>(),
	Schema.identifier("_TicketDbSchema")
);

export type TicketDbContext = Schema.Schema.Context<typeof _TicketDbSchema>;
export interface TicketDbEncoded
	extends Schema.Schema.Encoded<typeof _TicketDbSchema> {}
export interface TicketDb extends Schema.Schema.Type<typeof _TicketDbSchema> {}

export const TicketDbSchema: Schema.Schema<TicketDb, TicketDbEncoded> =
	_TicketDbSchema;
// #endregion TicketDbSchema

export const TicketDbToDomainSchema = transform(
	TicketDbSchema,
	TicketSchema,
	Effect.succeed,
	Effect.succeed
);
