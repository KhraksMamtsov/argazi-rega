import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { IdGeoPointSchema } from "../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import {
	type Place,
	type PlaceBase,
	PlaceSchema,
} from "../../../domain/place/entity/Place.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

import type { Place as _Place } from "@prisma/client";

export const PlaceDbSchema = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.string,
}).pipe(
	satisfies.to<PlaceBase>(),
	Schema.extend(BaseDbSchema),
	Schema.identifier("PlaceDbSchema"),
	satisfies.from<_Place>()
);

export const ToDomainSchema: Schema.Schema<Place, _Place> = transform(
	PlaceDbSchema,
	PlaceSchema,
	Effect.succeed,
	Effect.succeed
);
