import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
	type GeoPoint,
	GeoPointSchema,
	IdGeoPointSchema,
	IdUserSchema,
	LatitudeSchema,
	LongitudeSchema,
} from "@argazi/domain";
import { _TS, _SS, _S } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

import type { GeoPoint as _GeoPoint } from "@prisma/client";

export type GeoPointDbFrom = _TS.Simplify<Readonly<_GeoPoint>>;

// #region GeoPointDb
const _GeoPointDbSchema = Schema.struct({
	id: IdGeoPointSchema,
	idUser: IdUserSchema,
	latitude: _S.StringFromNumber.pipe(
		Schema.compose(Schema.Secret),
		Schema.compose(LatitudeSchema)
	),
	longitude: _S.StringFromNumber.pipe(
		Schema.compose(Schema.Secret),
		Schema.compose(LongitudeSchema)
	),
	name: Schema.optionFromNullable(Schema.Secret),
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("GeoPointDbSchema"),
	_SS.satisfies.from<GeoPointDbFrom>()
);

export type GeoPointDbContext = Schema.Schema.Context<typeof _GeoPointDbSchema>;
export interface GeoPointDbEncoded
	extends Schema.Schema.Encoded<typeof _GeoPointDbSchema> {}
export interface GeoPointDb
	extends Schema.Schema.Type<typeof _GeoPointDbSchema> {}

export const GeoPointDbSchema: Schema.Schema<GeoPointDb, GeoPointDbEncoded> =
	_GeoPointDbSchema;
// #endregion GeoPointDbSchema

const _GeoPointDbToDomainSchema = transform(
	GeoPointDbSchema,
	GeoPointSchema,
	Effect.succeed,
	Effect.succeed
);
export const GeoPointDbToDomainSchema: Schema.Schema<GeoPoint, GeoPointDbFrom> =
	_GeoPointDbToDomainSchema;
