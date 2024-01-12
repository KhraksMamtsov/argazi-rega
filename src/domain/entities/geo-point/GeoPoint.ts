import { Schema } from "@effect/schema";
import { GeoPointIdSchema } from "./GeoPointId.js";
import { UserIdSchema } from "../user/UserId.js";
import { LatitudeSchema } from "../../value-objects/Latitude.js";
import { LongitudeSchema } from "../../value-objects/Longitude.js";
import { BaseSchema } from "../common/Base.js";

const _GeoPointSchema = Schema.struct({
  id: GeoPointIdSchema,
  idUser: UserIdSchema,
  //
  name: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("GeoPointSchema"),
);

export interface GeoPointFrom
  extends Schema.Schema.From<typeof _GeoPointSchema> {}
export interface GeoPoint extends Schema.Schema.To<typeof _GeoPointSchema> {}

export const GeoPointSchema: Schema.Schema<GeoPointFrom, GeoPoint> =
  _GeoPointSchema;
