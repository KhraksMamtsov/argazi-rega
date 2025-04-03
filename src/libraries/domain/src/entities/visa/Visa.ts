import { Schema } from "effect";

import { IdVisa } from "./VisaId.js";

import { IdEvent } from "../../event/entity/IdEvent.js";
import { Price } from "../../value-objects/Price.js";
import { IdVisitor } from "../../visitor/IdVisitor.js";
import { Base } from "../common/Base.js";
import { TransportOnEvent } from "../transport-on-event/TransportOnEvent.js";

const _Visa = Schema.Struct({
  id: IdVisa,
  idEvent: IdEvent,
  idTransportOnEvent: Schema.Option(TransportOnEvent),
  idVisitor: IdVisitor,
  //
  totalPrice: Price,
}).pipe(Schema.extend(Base), Schema.annotations({ identifier: "Visa" }));

export type VisaFrom = Schema.Schema.Encoded<typeof _Visa>;
export type Visa = Schema.Schema.Type<typeof _Visa>;

export const Visa: Schema.Schema<Visa, VisaFrom> = _Visa;
