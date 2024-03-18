import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdEventSchema } from "../../../../domain/event/entity/IdEvent.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";

export const _GetEventResponseBodySchema = EventApi.pipe(
	Schema.identifier("GetEventResponseSchema"),
	BaseResponseFor
);

export interface GetEventResponseBodyFrom
	extends Schema.Schema.Encoded<typeof _GetEventResponseBodySchema> {}
export interface GetEventResponseBody
	extends Schema.Schema.Type<typeof _GetEventResponseBodySchema> {}

export const GetEventResponseBodySchema: Schema.Schema<
	GetEventResponseBody,
	GetEventResponseBodyFrom
> = _GetEventResponseBodySchema;

export const _GetEventRequestPathSchema = Schema.struct({
	idEvent: IdEventSchema,
});

export interface GetEventRequestPathFrom
	extends Schema.Schema.Encoded<typeof _GetEventRequestPathSchema> {}
export interface GetEventRequestPath
	extends Schema.Schema.Type<typeof _GetEventRequestPathSchema> {}

export const GetEventRequestPathSchema: Schema.Schema<
	GetEventRequestPath,
	GetEventRequestPathFrom
> = _GetEventRequestPathSchema;

export const GetEventEndpoint = ApiEndpoint.get(
	"getEvent",
	"/events/:idEvent",
	{}
).pipe(
	ApiEndpoint.setRequestPath(GetEventRequestPathSchema),
	ApiEndpoint.setResponseBody(GetEventResponseBodySchema)
);
