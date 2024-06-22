import { Schema } from "@effect/schema";

import { IdPlace } from "./IdPlace.js";

import { Base } from "../../entities/common/Base.js";
import { IdGeoPoint } from "../../geo-point/entity/IdGeoPoint.js";

export const PlaceBase = Schema.Struct({
  id: IdPlace,
  idGeoPoint: IdGeoPoint,
  name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
  description: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(Schema.typeSchema, Schema.annotations({ identifier: "PlaceBase" }));

export interface PlaceBase extends Schema.Schema.Type<typeof PlaceBase> {}

const _Place = PlaceBase.pipe(
  //
  Schema.extend(Base),
  Schema.annotations({ identifier: "Place" })
);

export interface Place extends Schema.Schema.Type<typeof _Place> {}

export const Place: Schema.Schema<Place> = _Place;
