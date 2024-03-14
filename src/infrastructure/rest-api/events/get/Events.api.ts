import * as Schema from "@effect/schema/Schema";

import { IdEventSchema } from "../../../../domain/event/entity/IdEvent.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";

export const _GetEventResponseSchema = EventApi.pipe(
	Schema.identifier("GetEventResponseSchema"),
	BaseResponseFor
);

export interface GetEventResponseFrom
	extends Schema.Schema.Encoded<typeof _GetEventResponseSchema> {}
export interface GetEventResponse
	extends Schema.Schema.Type<typeof _GetEventResponseSchema> {}

export const GetEventResponseSchema: Schema.Schema<
	GetEventResponse,
	GetEventResponseFrom
> = _GetEventResponseSchema;

export const GetEventRequest = {
	params: Schema.struct({
		idEvent: IdEventSchema,
	}),
};

export const GetEventResponse = GetEventResponseSchema.pipe(
	Schema.description("Event")
);
