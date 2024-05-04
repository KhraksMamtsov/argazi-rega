import { Schema } from "@effect/schema";
import { type Transport as _Transport } from "@prisma/client";
import { Effect } from "effect";

import { IdTransport, Transport, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

export type TransportDbFrom = Readonly<_Transport>;

// #region TransportDb
const _TransportDb = Schema.Struct({
  color: Schema.Trim.pipe(Schema.nonEmpty()),
  id: IdTransport,
  idUser: IdUser,
  model: Schema.OptionFromNullOr(Schema.Secret),
  number: Schema.Secret,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  Schema.extend(BaseDb),
  Schema.identifier("_TransportDb"),
  _SS.satisfies.encoded<TransportDbFrom>()
);

export type TransportDbContext = Schema.Schema.Context<typeof _TransportDb>;
export interface TransportDbEncoded
  extends Schema.Schema.Encoded<typeof _TransportDb> {}
export interface TransportDb extends Schema.Schema.Type<typeof _TransportDb> {}

export const TransportDb: Schema.Schema<TransportDb, TransportDbEncoded> =
  _TransportDb;
// #endregion TransportDb

export const TransportDbToDomain = transform(
  TransportDb,
  Transport,
  Effect.succeed,
  Effect.succeed
);
