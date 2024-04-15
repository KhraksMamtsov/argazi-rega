import { Schema } from "@effect/schema";

import { IdTicketSchema } from "./IdTicket.js";
import { TicketRoleSchema } from "./TicketRole.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdTransportOnEventSchema } from "../../entities/transport-on-event/IdTransportOnEvent.js";
import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";

export const TicketBaseSchema = Schema.Struct({
  dateRegistered: Schema.ValidDateFromSelf,
  id: IdTicketSchema,
  idEvent: IdEventSchema,
  idTransport: Schema.OptionFromSelf(IdTransportOnEventSchema),
  idUser: IdUserSchema,
  //
  role: TicketRoleSchema,
}).pipe(Schema.identifier("TicketBaseSchema"));

export interface TicketBase
  extends Schema.Schema.Type<typeof TicketBaseSchema> {}

export const _TicketSchema = TicketBaseSchema.pipe(
  Schema.typeSchema,
  Schema.extend(BaseSchema),
  Schema.identifier("TicketSchema")
);

export interface TicketFrom
  extends Schema.Schema.Encoded<typeof _TicketSchema> {}
export interface Ticket extends Schema.Schema.Type<typeof _TicketSchema> {}

export const TicketSchema: Schema.Schema<Ticket, TicketFrom> = _TicketSchema;
