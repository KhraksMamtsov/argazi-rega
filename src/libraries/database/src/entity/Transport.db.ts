import { type Transport as _Transport } from "@prisma/client";
import { Effect, Schema } from "effect";

import { IdTransport, Transport, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

export type TransportDbFrom = Readonly<_Transport>;

// #region TransportDb
const _TransportDb = Schema.Struct({
  color: Schema.Trim.pipe(Schema.nonEmptyString()),
  id: IdTransport,
  idUser: IdUser,
  model: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  number: Schema.Redacted(Schema.String),
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "_TransportDb" }),
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
