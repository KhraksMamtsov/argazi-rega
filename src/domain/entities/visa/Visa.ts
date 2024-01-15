import { Schema } from "@effect/schema";

import { VisaIdSchema } from "./VisaId.js";

import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { BaseSchema } from "../common/Base.js";
import { TransportOnEventSchema } from "../transport-on-event/TransportOnEvent.js";
import { IdVisitorSchema } from "../visitor/IdVisitor.js";

const _VisaSchema = Schema.struct({
	id: VisaIdSchema,
	idEvent: IdEventSchema,
	idTransportOnEvent: Schema.option(TransportOnEventSchema),
	idVisitor: IdVisitorSchema,
	//
	totalPrice: PriceSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisaSchema"));

export type VisaFrom = Schema.Schema.From<typeof _VisaSchema>;
export type Visa = Schema.Schema.To<typeof _VisaSchema>;

export const VisaSchema: Schema.Schema<Visa, VisaFrom> = _VisaSchema;
