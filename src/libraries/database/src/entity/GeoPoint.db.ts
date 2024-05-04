import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
  GeoPoint,
  IdGeoPoint,
  IdUser,
  Latitude,
  Longitude,
} from "@argazi/domain";
import { _TS, _SS, _S } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

import type { GeoPoint as _GeoPoint } from "@prisma/client";

export type GeoPointDbFrom = _TS.Simplify<Readonly<_GeoPoint>>;

// #region GeoPointDb
const _GeoPointDb = Schema.Struct({
  id: IdGeoPoint,
  idUser: IdUser,
  latitude: _S.StringFromNumber.pipe(
    Schema.compose(Schema.Secret),
    Schema.compose(Latitude)
  ),
  longitude: _S.StringFromNumber.pipe(
    Schema.compose(Schema.Secret),
    Schema.compose(Longitude)
  ),
  name: Schema.OptionFromNullOr(Schema.Secret),
}).pipe(
  Schema.extend(BaseDb),
  Schema.identifier("GeoPointDb"),
  _SS.satisfies.encoded<GeoPointDbFrom>()
);

export type GeoPointDbContext = Schema.Schema.Context<typeof _GeoPointDb>;
export interface GeoPointDbEncoded
  extends Schema.Schema.Encoded<typeof _GeoPointDb> {}
export interface GeoPointDb extends Schema.Schema.Type<typeof _GeoPointDb> {}

export const GeoPointDb: Schema.Schema<GeoPointDb, GeoPointDbEncoded> =
  _GeoPointDb;
// #endregion GeoPointDb

const _GeoPointDbToDomain = transform(
  GeoPointDb,
  GeoPoint,
  Effect.succeed,
  Effect.succeed
);
export const GeoPointDbToDomain: Schema.Schema<GeoPoint, GeoPointDbFrom> =
  _GeoPointDbToDomain;
