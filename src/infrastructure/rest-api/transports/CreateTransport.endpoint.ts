import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { TransportApiSchema } from "./Transport.api.js";

import { CreateTransportCommandPayloadSchema } from "../../../application/use-cases/transport/create/CreateTransport.command.js";
import { BaseResponseFor } from "../BaseResponseFor.js";

// #region CreateTransportRequestBody
const _CreateTransportRequestBodySchema =
	CreateTransportCommandPayloadSchema.pipe(
		Schema.identifier("CreateTransportRequestBodySchema")
	);

export type CreateTransportRequestBodyContext = Schema.Schema.Context<
	typeof _CreateTransportRequestBodySchema
>;
export interface CreateTransportRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _CreateTransportRequestBodySchema> {}
export interface CreateTransportRequestBody
	extends Schema.Schema.Type<typeof _CreateTransportRequestBodySchema> {}

export const CreateTransportRequestBodySchema: Schema.Schema<
	CreateTransportRequestBody,
	CreateTransportRequestBodyEncoded
> = _CreateTransportRequestBodySchema;
// #endregion CreateTransportRequestBodySchema

// #region CreateTransportResponse
const _CreateTransportResponseSchema = TransportApiSchema.pipe(
	Schema.identifier("CreateTransportResponseSchema"),
	BaseResponseFor
);

export type CreateTransportResponseContext = Schema.Schema.Context<
	typeof _CreateTransportResponseSchema
>;
export interface CreateTransportResponseEncoded
	extends Schema.Schema.Encoded<typeof _CreateTransportResponseSchema> {}
export interface CreateTransportResponse
	extends Schema.Schema.Type<typeof _CreateTransportResponseSchema> {}

export const CreateTransportResponseSchema: Schema.Schema<
	CreateTransportResponse,
	CreateTransportResponseEncoded
> = _CreateTransportResponseSchema;
// #endregion CreateTransportResponseSchema

export const CreateTransportEndpoint = ApiEndpoint.post(
	"createTransport",
	"/transports",
	{}
).pipe(
	ApiEndpoint.setRequestBody(CreateTransportRequestBodySchema),
	ApiEndpoint.setResponseBody(CreateTransportResponseSchema)
);
