import { Schema } from "@effect/schema";
import { VisitorOnEventPaymentIdSchema } from "./VisitorOnEventPaymentId.js";
import { BaseSchema } from "../common/Base.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { VisitorOnEventIdSchema } from "../visitor-on-event/VisitorOnEventId.js";
import { UserOnEventIdSchema } from "../user-on-event/UserOnEventId.js";

const _VisitorOnEventPaymentSchema = Schema.struct({
  id: VisitorOnEventPaymentIdSchema,
  idVisitorOnEvent: VisitorOnEventIdSchema,
  idCashier: UserOnEventIdSchema,
  //
  payed: PriceSchema,
}).pipe(
  Schema.extend(BaseSchema),
  Schema.identifier("VisitorOnEventPaymentSchema"),
);

export interface VisitorOnEventPaymentFrom
  extends Schema.Schema.From<typeof _VisitorOnEventPaymentSchema> {}
export interface VisitorOnEventPaymentPayment
  extends Schema.Schema.To<typeof _VisitorOnEventPaymentSchema> {}

export const VisitorOnEventPaymentSchema: Schema.Schema<
  VisitorOnEventPaymentFrom,
  VisitorOnEventPaymentPayment
> = _VisitorOnEventPaymentSchema;
