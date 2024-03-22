import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { IdGeoPointSchema } from "@argazi/domain";
import { IdPlaceSchema } from "@argazi/domain";
import { type Place, type PlaceBase, PlaceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

import type { Place as _Place } from "@prisma/client";

// #region PlaceDb
const _PlaceDbSchema = Schema.struct({
  id: IdPlaceSchema,
  idGeoPoint: IdGeoPointSchema,
  name: Schema.string,
}).pipe(
  _SS.satisfies.to<PlaceBase>(),
  Schema.extend(BaseDbSchema),
  Schema.identifier("PlaceDbSchema"),
  _SS.satisfies.from<_Place>()
);

export type PlaceDbContext = Schema.Schema.Context<typeof _PlaceDbSchema>;
export interface PlaceDbEncoded
  extends Schema.Schema.Encoded<typeof _PlaceDbSchema> {}
export interface PlaceDb extends Schema.Schema.Type<typeof _PlaceDbSchema> {}

export const PlaceDbSchema: Schema.Schema<PlaceDb, PlaceDbEncoded> =
  _PlaceDbSchema;
// #endregion PlaceDbSchema

export const PlaceDbToDomainSchema: Schema.Schema<Place, _Place> = transform(
  PlaceDbSchema,
  PlaceSchema,
  Effect.succeed,
  Effect.succeed
);
