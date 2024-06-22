import { Schema } from "@effect/schema";

import { IdTicket } from "./IdTicket.js";
import { TicketRoleSchema } from "./TicketRole.js";

import { Base } from "../../entities/common/Base.js";
import { IdTransportOnEvent } from "../../entities/transport-on-event/IdTransportOnEvent.js";
import { IdEvent } from "../../event/entity/IdEvent.js";
import { IdUser } from "../../user/entity/IdUser.js";

export const TicketBase = Schema.Struct({
  dateRegistered: Schema.ValidDateFromSelf,
  id: IdTicket,
  idEvent: IdEvent,
  idTransport: Schema.OptionFromSelf(IdTransportOnEvent),
  idUser: IdUser,
  //
  role: TicketRoleSchema,
}).pipe(Schema.annotations({ identifier: "TicketBase" }));

export interface TicketBase extends Schema.Schema.Type<typeof TicketBase> {}

export const _Ticket = TicketBase.pipe(
  Schema.typeSchema,
  Schema.extend(Base),
  Schema.annotations({ identifier: "Ticket" })
);

export interface TicketFrom extends Schema.Schema.Encoded<typeof _Ticket> {}
export interface Ticket extends Schema.Schema.Type<typeof _Ticket> {}

export const Ticket: Schema.Schema<Ticket, TicketFrom> = _Ticket;
