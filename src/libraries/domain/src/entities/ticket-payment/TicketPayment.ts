import { Schema } from "@effect/schema";

import { IdTicketPayment } from "./TicketPaymentId.js";

import { IdTicket } from "../../ticket/entity/IdTicket.js";
import { Price } from "../../value-objects/Price.js";
import { Base } from "../common/Base.js";

const _TicketPayment = Schema.Struct({
  id: IdTicketPayment,
  idCashier: IdTicket,
  idTicket: IdTicket,
  //
  payed: Price,
}).pipe(Schema.extend(Base), Schema.identifier("TicketPayment"));

export type TicketPaymentFrom = Schema.Schema.Encoded<typeof _TicketPayment>;
export type TicketPayment = Schema.Schema.Type<typeof _TicketPayment>;

export const TicketPayment: Schema.Schema<TicketPayment, TicketPaymentFrom> =
  _TicketPayment;
