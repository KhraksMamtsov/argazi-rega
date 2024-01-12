import { Schema } from "@effect/schema";
import { UserOnEventPaymentIdSchema } from "./UserOnEventPaymentId.js";
import { BaseSchema } from "../common/Base.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { UserOnEventIdSchema } from "../user-on-event/UserOnEventId.js";

const _UserOnEventPaymentSchema = Schema.struct({
  id: UserOnEventPaymentIdSchema,
  idUserOnEvent: UserOnEventIdSchema,
  idCashier: UserOnEventIdSchema,
  //
  payed: PriceSchema,
}).pipe(
  Schema.extend(BaseSchema),
  Schema.identifier("UserOnEventPaymentSchema"),
);

export interface UserOnEventPaymentFrom
  extends Schema.Schema.From<typeof _UserOnEventPaymentSchema> {}
export interface UserOnEventPaymentPayment
  extends Schema.Schema.To<typeof _UserOnEventPaymentSchema> {}

export const UserOnEventPaymentSchema: Schema.Schema<
  UserOnEventPaymentFrom,
  UserOnEventPaymentPayment
> = _UserOnEventPaymentSchema;
