import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
	type GeoPoint,
	GeoPointSchema,
} from "../../../domain/geo-point/entity/GeoPoint.js";
import { IdGeoPointSchema } from "../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { LatitudeSchema } from "../../../domain/value-objects/Latitude.js";
import { LongitudeSchema } from "../../../domain/value-objects/Longitude.js";
import { StringFromNumber } from "../../../libs/Schema.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

import type { Simplify } from "../../../libs/Typescript.js";
import type { GeoPoint as _GeoPoint } from "@prisma/client";

export type GeoPointDbFrom = Simplify<Readonly<_GeoPoint>>;

const GeoPointDbSchema = Schema.struct({
	id: IdGeoPointSchema,
	idUser: IdUserSchema,
	latitude: StringFromNumber.pipe(
		Schema.compose(Schema.Secret),
		Schema.compose(LatitudeSchema)
	),
	longitude: StringFromNumber.pipe(
		Schema.compose(Schema.Secret),
		Schema.compose(LongitudeSchema)
	),
	name: Schema.optionFromNullable(Schema.Secret),
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("GeoPointDbSchema"),
	satisfies.from<GeoPointDbFrom>()
);

const schema = transform(
	GeoPointDbSchema,
	GeoPointSchema,
	Effect.succeed,
	Effect.succeed
);
export const ToDomainSchema: Schema.Schema<GeoPoint, GeoPointDbFrom> = schema;
