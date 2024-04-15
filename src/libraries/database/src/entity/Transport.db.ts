import { Schema } from "@effect/schema";
import { type Transport as _Transport } from "@prisma/client";
import { Effect } from "effect";

import {
  IdTransportSchema,
  TransportSchema,
  IdUserSchema,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

export type TransportDbFrom = Readonly<_Transport>;

// #region TransportDb
const _TransportDbSchema = Schema.Struct({
  color: Schema.Trim.pipe(Schema.nonEmpty()),
  id: IdTransportSchema,
  idUser: IdUserSchema,
  model: Schema.OptionFromNullOr(Schema.Secret),
  number: Schema.Secret,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  Schema.extend(BaseDbSchema),
  Schema.identifier("_TransportDbSchema"),
  _SS.satisfies.from<TransportDbFrom>()
);

export type TransportDbContext = Schema.Schema.Context<
  typeof _TransportDbSchema
>;
export interface TransportDbEncoded
  extends Schema.Schema.Encoded<typeof _TransportDbSchema> {}
export interface TransportDb
  extends Schema.Schema.Type<typeof _TransportDbSchema> {}

export const TransportDbSchema: Schema.Schema<TransportDb, TransportDbEncoded> =
  _TransportDbSchema;
// #endregion TransportDbSchema

export const TransportDbToDomainSchema = transform(
  TransportDbSchema,
  TransportSchema,
  Effect.succeed,
  Effect.succeed
);
