import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { CreateGeoPointCommandPayloadSchema } from "@argazi/application";

import { GeoPointApiSchema } from "./GeoPoint.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { BearerAuth } from "../BearerAuth.security-scheme.js";

export const _CreateGeoPointRequestBodySchema =
	CreateGeoPointCommandPayloadSchema.pipe(
		Schema.identifier("CreateGeoPointRequestBodySchema")
	);

export interface CreateGeoPointRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _CreateGeoPointRequestBodySchema> {}

export interface CreateGeoPointRequestBody
	extends Schema.Schema.Type<typeof _CreateGeoPointRequestBodySchema> {}

export const CreateGeoPointRequestBodySchema: Schema.Schema<
	CreateGeoPointRequestBody,
	CreateGeoPointRequestBodyEncoded
> = _CreateGeoPointRequestBodySchema;

const _CreateGeoPointResponseBodySchema = GeoPointApiSchema.pipe(
	Schema.identifier("CreateGeoPointResponseBodySchema"),
	BaseResponseFor
);

export interface CreateGeoPointResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _CreateGeoPointResponseBodySchema> {}

export interface CreateGeoPointResponseBody
	extends Schema.Schema.Type<typeof _CreateGeoPointResponseBodySchema> {}

export const CreateGeoPointResponseSchema: Schema.Schema<
	CreateGeoPointResponseBody,
	CreateGeoPointResponseBodyEncoded
> = _CreateGeoPointResponseBodySchema;

export const CreateGeoPointEndpoint = ApiEndpoint.post(
	"createGeoPoint",
	"/geo-points"
).pipe(
	ApiEndpoint.setRequestBody(CreateGeoPointRequestBodySchema),
	ApiEndpoint.setResponse(ApiResponse.make(200, CreateGeoPointResponseSchema)),
	ApiEndpoint.addResponse(ApiResponse.make(401)),
	ApiEndpoint.setSecurity(BearerAuth)
);
