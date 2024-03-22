import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateEventCommandPayloadSchema } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";

export const CreateEventRequestBodySchema =
  CreateEventCommandPayloadSchema.pipe(
    Schema.identifier("CreateEventRequestBodySchema")
  );

const _CreateEventResponseSchema = EventApi.pipe(
  Schema.identifier("CreateEventResponseSchema"),
  BaseResponseFor
);

export interface CreateEventResponseFrom
  extends Schema.Schema.Encoded<typeof _CreateEventResponseSchema> {}
export interface CreateEventResponse
  extends Schema.Schema.Type<typeof _CreateEventResponseSchema> {}

export const CreateEventResponseSchema: Schema.Schema<
  CreateEventResponse,
  CreateEventResponseFrom
> = _CreateEventResponseSchema;

export const CreateEventEndpoint = ApiEndpoint.post(
  "createEvent",
  "/events",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreateEventRequestBodySchema),
  ApiEndpoint.setResponseBody(CreateEventResponseSchema)
);
