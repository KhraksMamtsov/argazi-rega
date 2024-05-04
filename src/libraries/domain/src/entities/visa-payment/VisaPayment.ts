import { Schema } from "@effect/schema";

import { IdVisaPayment } from "./VisaPaymentId.js";

import { IdTicket } from "../../ticket/entity/IdTicket.js";
import { Price } from "../../value-objects/Price.js";
import { Base } from "../common/Base.js";
import { IdVisa } from "../visa/VisaId.js";

const _VisaPayment = Schema.Struct({
  id: IdVisaPayment,
  idGuarantor: IdTicket,
  idVisa: IdVisa,
  //
  payed: Price,
}).pipe(Schema.extend(Base), Schema.identifier("VisaPayment"));

export type VisaPaymentFrom = Schema.Schema.Encoded<typeof _VisaPayment>;
export type VisaPayment = Schema.Schema.Type<typeof _VisaPayment>;

export const VisaPayment: Schema.Schema<VisaPayment, VisaPaymentFrom> =
  _VisaPayment;
