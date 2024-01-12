import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { PlaceIdSchema } from "./PlaceId.js";
import { GeoPointIdSchema } from "../geo-point/GeoPointId.js";

const _PlaceSchema = Schema.struct({
  id: PlaceIdSchema,
  idGeoPoint: GeoPointIdSchema,
  //
  name: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("PlaceSchema"),
);

export interface PlaceFrom extends Schema.Schema.From<typeof _PlaceSchema> {}
export interface Place extends Schema.Schema.To<typeof _PlaceSchema> {}

export const PlaceSchema: Schema.Schema<PlaceFrom, Place> = _PlaceSchema;
