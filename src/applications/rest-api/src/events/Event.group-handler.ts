import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { CreateEventHandlerLive } from "./create/CreateEvent.handler.js";
import { GetEventHandlerLive } from "./get/GetEvent.handler.js";

export const EventGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Event",
  (handlers) =>
    handlers
      .handle("getEvent", GetEventHandlerLive)
      .handle("createEvent", CreateEventHandlerLive)
);
