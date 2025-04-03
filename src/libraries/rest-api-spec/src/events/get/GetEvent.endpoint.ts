import { Schema } from "effect";

import { IdEvent } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { EventApi } from "../Event.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const _GetEventResponseBody = EventApi.pipe(
  Schema.annotations({ identifier: "GetEventResponse" }),
  BaseResponseFor
);

export interface GetEventResponseBodyFrom
  extends Schema.Schema.Encoded<typeof _GetEventResponseBody> {}
export interface GetEventResponseBody
  extends Schema.Schema.Type<typeof _GetEventResponseBody> {}

export const GetEventResponseBody: Schema.Schema<
  GetEventResponseBody,
  GetEventResponseBodyFrom
> = _GetEventResponseBody;

export const _GetEventRequestPath = Schema.Struct({
  idEvent: IdEvent,
});

export interface GetEventRequestPathFrom
  extends Schema.Schema.Encoded<typeof _GetEventRequestPath> {}
export interface GetEventRequestPath
  extends Schema.Schema.Type<typeof _GetEventRequestPath> {}

export const GetEventRequestPath: Schema.Schema<
  GetEventRequestPath,
  GetEventRequestPathFrom
> = _GetEventRequestPath;

export const GetEventEndpoint = HttpApiEndpoint.get(
  "getEvent",
  "/events/:idEvent"
)
  .setPath(GetEventRequestPath)
  .addSuccess(GetEventResponseBody);
