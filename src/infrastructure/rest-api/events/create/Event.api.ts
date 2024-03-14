import * as Schema from "@effect/schema/Schema";

import { CreateEventCommandPayloadSchema } from "../../../../application/use-cases/event/create/CreateEvent.command.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";

export const CreateEventRequest = {
	body: CreateEventCommandPayloadSchema.pipe(
		Schema.identifier("CreateEventRequestBodySchema")
	),
};

const _CreateEventResponseSchema = EventApi.pipe(
	Schema.identifier("CreateEventResponseSchema"),
	BaseResponseFor
);

export type CreateEventResponseFrom = Schema.Schema.Encoded<
	typeof _CreateEventResponseSchema
>;
export type CreateEventResponse = Schema.Schema.Type<
	typeof _CreateEventResponseSchema
>;

export const CreateEventResponseSchema: Schema.Schema<
	CreateEventResponse,
	CreateEventResponseFrom
> = _CreateEventResponseSchema;
