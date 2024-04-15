import { Schema } from "@effect/schema";

import { VisaPaymentIdSchema } from "./VisaPaymentId.js";

import { IdTicketSchema } from "../../ticket/entity/IdTicket.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { BaseSchema } from "../common/Base.js";
import { VisaIdSchema } from "../visa/VisaId.js";

const _VisaPaymentSchema = Schema.Struct({
  id: VisaPaymentIdSchema,
  idGuarantor: IdTicketSchema,
  idVisa: VisaIdSchema,
  //
  payed: PriceSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisaPaymentSchema"));

export type VisaPaymentFrom = Schema.Schema.Encoded<typeof _VisaPaymentSchema>;
export type VisaPayment = Schema.Schema.Type<typeof _VisaPaymentSchema>;

export const VisaPaymentSchema: Schema.Schema<VisaPayment, VisaPaymentFrom> =
  _VisaPaymentSchema;
