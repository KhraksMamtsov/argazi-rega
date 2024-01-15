import * as Schema from "@effect/schema/Schema";

import { TransportApi } from "./Transport.api.js";

import { CreateTransportCommandPayloadSchema } from "../../../application/use-cases/transport/create/CreateTransport.command.js";
import { BaseResponseFor } from "../BaseResponseFor.js";

export const CreateTransportRequest = {
	body: CreateTransportCommandPayloadSchema.pipe(
		Schema.identifier("CreateTransportRequestBodySchema")
	),
};

export const CreateTransportResponseSchema = TransportApi.pipe(
	Schema.identifier("CreateTransportResponseSchema"),
	BaseResponseFor
);
