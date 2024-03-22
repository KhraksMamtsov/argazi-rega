import { Schema } from "@effect/schema";

import { IdGeoPointSchema } from "./IdGeoPoint.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";
import { LatitudeSchema } from "../../value-objects/Latitude.js";
import { LongitudeSchema } from "../../value-objects/Longitude.js";

export const GeoPointBaseSchema = Schema.struct({
  id: IdGeoPointSchema,
  idUser: IdUserSchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  name: Schema.optionFromSelf(Schema.SecretFromSelf),
}).pipe(Schema.typeSchema, Schema.identifier("GeoPointBaseSchema"));

export interface GeoPointBase
  extends Schema.Schema.Type<typeof GeoPointBaseSchema> {}

export const GeoPointSchema = GeoPointBaseSchema.pipe(
  Schema.extend(BaseSchema),
  Schema.identifier("GeoPointSchema")
);

export interface GeoPoint extends Schema.Schema.Type<typeof GeoPointSchema> {}
