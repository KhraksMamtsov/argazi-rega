import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "./IdPlace.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdGeoPointSchema } from "../../geo-point/entity/IdGeoPoint.js";

export const PlaceBaseSchema = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(Schema.to, Schema.identifier("PlaceBaseSchema"));

export type PlaceBase = Schema.Schema.To<typeof PlaceBaseSchema>;

const _PlaceSchema = PlaceBaseSchema.pipe(
	//
	Schema.extend(BaseSchema),
	Schema.identifier("PlaceSchema")
);

export interface Place extends Schema.Schema.To<typeof _PlaceSchema> {}

export const PlaceSchema: Schema.Schema<Place> = _PlaceSchema;
