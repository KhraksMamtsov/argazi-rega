import * as Schema from "@effect/schema/Schema";

import { CreatePlaceCommandPayloadSchema } from "../../../../application/use-cases/place/create/CreatePlace.command.js";
import { IdGeoPointSchema } from "../../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { type PlaceBase } from "../../../../domain/place/entity/Place.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";

export const CreatePlaceRequest = {
	body: CreatePlaceCommandPayloadSchema.pipe(
		Schema.identifier("CreatePlaceRequestBodySchema")
	),
};

const _CreatePlaceResponseSchema = Schema.struct({
	id: IdPlaceSchema,
	idGeoPoint: IdGeoPointSchema,
	name: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
	satisfies.to<PlaceBase>(),
	satisfies.from.json(),
	Schema.identifier("CreatePlaceResponseSchema"),
	BaseResponseFor
);

export type CreatePlaceResponseFrom = Schema.Schema.Encoded<
	typeof _CreatePlaceResponseSchema
>;
export type CreatePlaceResponse = Schema.Schema.Type<
	typeof _CreatePlaceResponseSchema
>;

export const CreatePlaceResponseSchema: Schema.Schema<
	CreatePlaceResponse,
	CreatePlaceResponseFrom
> = _CreatePlaceResponseSchema;
