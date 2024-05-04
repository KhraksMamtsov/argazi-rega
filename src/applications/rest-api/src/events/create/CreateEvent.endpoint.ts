import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateEventCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";

export const CreateEventRequestBody = CreateEventCommandPayload.pipe(
  Schema.identifier("CreateEventRequestBody")
);

const _CreateEventResponse = EventApi.pipe(
  Schema.identifier("CreateEventResponse"),
  BaseResponseFor
);

export interface CreateEventResponseFrom
  extends Schema.Schema.Encoded<typeof _CreateEventResponse> {}
export interface CreateEventResponse
  extends Schema.Schema.Type<typeof _CreateEventResponse> {}

export const CreateEventResponse: Schema.Schema<
  CreateEventResponse,
  CreateEventResponseFrom
> = _CreateEventResponse;

export const CreateEventEndpoint = ApiEndpoint.post(
  "createEvent",
  "/events",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreateEventRequestBody),
  ApiEndpoint.setResponseBody(CreateEventResponse)
);
