import { Schema } from "@effect/schema";

import { TicketPaymentIdSchema } from "./TicketPaymentId.js";

import { IdTicketSchema } from "../../ticket/entity/IdTicket.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { BaseSchema } from "../common/Base.js";

const _TicketPaymentSchema = Schema.Struct({
  id: TicketPaymentIdSchema,
  idCashier: IdTicketSchema,
  idTicket: IdTicketSchema,
  //
  payed: PriceSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("TicketPaymentSchema"));

export type TicketPaymentFrom = Schema.Schema.Encoded<
  typeof _TicketPaymentSchema
>;
export type TicketPayment = Schema.Schema.Type<typeof _TicketPaymentSchema>;

export const TicketPaymentSchema: Schema.Schema<
  TicketPayment,
  TicketPaymentFrom
> = _TicketPaymentSchema;
