import { Schema } from "effect";

import { CreateEventCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const CreateEventRequestBody = CreateEventCommandPayload.pipe(
  Schema.annotations({ identifier: "CreateEventRequestBody" })
);

const _CreateEventResponse = EventApi.pipe(
  Schema.annotations({ identifier: "CreateEventResponse" }),
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

export const CreateEventEndpoint = HttpApiEndpoint.post(
  "createEvent",
  "/events"
)
  .setPayload(CreateEventRequestBody)
  .addSuccess(CreateEventResponse);
