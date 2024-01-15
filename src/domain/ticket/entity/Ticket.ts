import { Schema } from "@effect/schema";

import { IdTicketSchema } from "./IdTicket.js";
import { TicketRoleSchema } from "./TicketRole.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdTransportOnEventSchema } from "../../entities/transport-on-event/IdTransportOnEvent.js";
import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";

export const TicketBaseSchema = Schema.struct({
	dateRegistered: Schema.ValidDateFromSelf,
	id: IdTicketSchema,
	idEvent: IdEventSchema,
	idTransport: Schema.optionFromSelf(IdTransportOnEventSchema),
	idUser: IdUserSchema,
	//
	role: TicketRoleSchema,
}).pipe(Schema.identifier("TicketBaseSchema"));

export type TicketBase = Schema.Schema.To<typeof TicketBaseSchema>;

export const _TicketSchema = TicketBaseSchema.pipe(
	Schema.to,
	Schema.extend(BaseSchema),
	Schema.identifier("TicketSchema")
);

export interface TicketFrom extends Schema.Schema.From<typeof _TicketSchema> {}
export interface Ticket extends Schema.Schema.To<typeof _TicketSchema> {}

export const TicketSchema: Schema.Schema<Ticket, TicketFrom> = _TicketSchema;
