import * as Schema from "@effect/schema/Schema";

import { GeoPointApiSchema } from "./GeoPoint.api.js";

import { CreateGeoPointCommandPayloadSchema } from "../../../application/use-cases/geo-point/create/CreateGeoPoint.command.js";
import { BaseResponseFor } from "../BaseResponseFor.js";

import type { InputEndpointSchemas } from "effect-http/Api";

export const CreateGeoPointRequest = {
	body: CreateGeoPointCommandPayloadSchema.pipe(
		Schema.identifier("CreateGeoPointRequestBodySchema")
	),
} satisfies InputEndpointSchemas["request"];

const _CreateGeoPointResponseSchema = GeoPointApiSchema.pipe(
	Schema.identifier("CreateGeoPointResponseSchema"),
	BaseResponseFor
);

export type CreateGeoPointResponseFrom = Schema.Schema.Encoded<
	typeof _CreateGeoPointResponseSchema
>;
export type CreateGeoPointResponse = Schema.Schema.Type<
	typeof _CreateGeoPointResponseSchema
>;

export const CreateGeoPointResponseSchema: Schema.Schema<
	CreateGeoPointResponse,
	CreateGeoPointResponseFrom
> = _CreateGeoPointResponseSchema;

export const CreateGeoPointResponse = [
	{ content: CreateGeoPointResponseSchema, status: 200 as const },
	{ content: Schema.struct({}), status: 401 as const },
];
