import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreatePlaceCommandPayloadSchema } from "../../../../application/use-cases/place/create/CreatePlace.command.js";
import { IdGeoPointSchema } from "../../../../domain/geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { type PlaceBase } from "../../../../domain/place/entity/Place.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";

// #region CreatePlaceRequestBody
const _CreatePlaceRequestBodySchema = CreatePlaceCommandPayloadSchema.pipe(
	Schema.identifier("CreatePlaceRequestBodySchema")
);

export type CreatePlaceRequestBodyContext = Schema.Schema.Context<
	typeof _CreatePlaceRequestBodySchema
>;
export interface CreatePlaceRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _CreatePlaceRequestBodySchema> {}
export interface CreatePlaceRequestBody
	extends Schema.Schema.Type<typeof _CreatePlaceRequestBodySchema> {}

export const CreatePlaceRequestBodySchema: Schema.Schema<
	CreatePlaceRequestBody,
	CreatePlaceRequestBodyEncoded
> = _CreatePlaceRequestBodySchema;
// #endregion CreatePlaceRequestBodySchema

// #region Schema for CreatePlaceResponse
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

export type CreatePlaceResponseContext = Schema.Schema.Context<
	typeof _CreatePlaceResponseSchema
>;
export interface CreatePlaceResponseEncoded
	extends Schema.Schema.Encoded<typeof _CreatePlaceResponseSchema> {}
export interface CreatePlaceResponse
	extends Schema.Schema.Type<typeof _CreatePlaceResponseSchema> {}

export const CreatePlaceResponseSchema: Schema.Schema<
	CreatePlaceResponse,
	CreatePlaceResponseEncoded
> = _CreatePlaceResponseSchema;
// #endregion Schema for  CreatePlaceResponseSchema

export const CreatePlaceEndpoint = ApiEndpoint.post(
	"createPlace",
	"/places",
	{}
).pipe(
	ApiEndpoint.setRequestBody(CreatePlaceRequestBodySchema),
	ApiEndpoint.setResponseBody(CreatePlaceResponseSchema)
);
