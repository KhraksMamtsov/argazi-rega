import { Schema } from "@effect/schema";

import { IdTransport } from "./IdTransport.js";

import { Base } from "../../entities/common/Base.js";
import { IdUser } from "../../user/entity/IdUser.js";

export const TransportBase = Schema.Struct({
  color: Schema.String.pipe(Schema.trimmed(), Schema.nonEmpty()),
  id: IdTransport,
  idUser: IdUser,
  model: Schema.SecretFromSelf.pipe(Schema.OptionFromSelf),
  //
  number: Schema.SecretFromSelf,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(Schema.typeSchema, Schema.identifier("TransportBase"));

export interface TransportBase
  extends Schema.Schema.Type<typeof TransportBase> {}

export const _Transport = TransportBase.pipe(
  Schema.extend(Base),
  Schema.identifier("Transport")
);

export interface Transport extends Schema.Schema.Type<typeof _Transport> {}

export const Transport: Schema.Schema<Transport> = _Transport;
