import { Schema } from "@effect/schema";

import { IdGeoPoint } from "./IdGeoPoint.js";

import { Base } from "../../entities/common/Base.js";
import { IdUser } from "../../user/entity/IdUser.js";
import { Latitude } from "../../value-objects/Latitude.js";
import { Longitude } from "../../value-objects/Longitude.js";

export const GeoPointBase = Schema.Struct({
  id: IdGeoPoint,
  idUser: IdUser,
  latitude: Latitude,
  longitude: Longitude,
  name: Schema.OptionFromSelf(Schema.RedactedFromSelf(Schema.String)),
}).pipe(Schema.typeSchema, Schema.annotations({ identifier: "GeoPointBase" }));

export interface GeoPointBase extends Schema.Schema.Type<typeof GeoPointBase> {}

export const GeoPoint = GeoPointBase.pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "GeoPoint" })
);

export interface GeoPoint extends Schema.Schema.Type<typeof GeoPoint> {}
