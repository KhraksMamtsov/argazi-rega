import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "./IdPlace.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdGeoPointSchema } from "../../geo-point/entity/IdGeoPoint.js";

export const PlaceBaseSchema = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.compose(Schema.Trimmed, Schema.NonEmpty),
}).pipe(Schema.typeSchema, Schema.identifier("PlaceBaseSchema"));

export type PlaceBase = Schema.Schema.Type<typeof PlaceBaseSchema>;

const _PlaceSchema = PlaceBaseSchema.pipe(
	//
	Schema.extend(BaseSchema),
	Schema.identifier("PlaceSchema")
);

export interface Place extends Schema.Schema.Type<typeof _PlaceSchema> {}

export const PlaceSchema: Schema.Schema<Place> = _PlaceSchema;
