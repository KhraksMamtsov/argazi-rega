import { Schema } from "@effect/schema";

import { VisaIdSchema } from "./VisaId.js";

import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { IdVisitorSchema } from "../../visitor/IdVisitor.js";
import { BaseSchema } from "../common/Base.js";
import { TransportOnEventSchema } from "../transport-on-event/TransportOnEvent.js";

const _VisaSchema = Schema.Struct({
  id: VisaIdSchema,
  idEvent: IdEventSchema,
  idTransportOnEvent: Schema.Option(TransportOnEventSchema),
  idVisitor: IdVisitorSchema,
  //
  totalPrice: PriceSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisaSchema"));

export type VisaFrom = Schema.Schema.Encoded<typeof _VisaSchema>;
export type Visa = Schema.Schema.Type<typeof _VisaSchema>;

export const VisaSchema: Schema.Schema<Visa, VisaFrom> = _VisaSchema;
