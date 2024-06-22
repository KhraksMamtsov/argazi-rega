import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { IdGeoPoint } from "@argazi/domain";
import { IdPlace } from "@argazi/domain";
import { type PlaceBase, Place } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

import type { Place as _Place } from "@prisma/client";

// #region PlaceDb
const _PlaceDb = Schema.Struct({
  id: IdPlace,
  idGeoPoint: IdGeoPoint,
  name: Schema.String,
  description: Schema.String,
}).pipe(
  _SS.satisfies.type<PlaceBase>(),
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "PlaceDb" }),
  _SS.satisfies.encoded<_Place>()
);

export type PlaceDbContext = Schema.Schema.Context<typeof _PlaceDb>;
export interface PlaceDbEncoded
  extends Schema.Schema.Encoded<typeof _PlaceDb> {}
export interface PlaceDb extends Schema.Schema.Type<typeof _PlaceDb> {}

export const PlaceDb: Schema.Schema<PlaceDb, PlaceDbEncoded> = _PlaceDb;
// #endregion PlaceDb

export const PlaceDbToDomain: Schema.Schema<Place, _Place> = transform(
  PlaceDb,
  Place,
  Effect.succeed,
  Effect.succeed
);
