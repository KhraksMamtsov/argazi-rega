import { Api } from "effect-http";

import * as CreateEventEndpoint from "./create/Event.api.js";
import * as GetEventsEndpoint from "./get/Events.api.js";

export const EventsEndpointGroup = Api.apiGroup("event").pipe(
	Api.post("createEvent", "/events", {
		request: CreateEventEndpoint.CreateEventRequest,
		response: CreateEventEndpoint.CreateEventResponseSchema,
	}),
	Api.get("getEvent", "/events/:idEvent", {
		request: GetEventsEndpoint.GetEventRequest,
		response: GetEventsEndpoint.GetEventResponse,
	})
);
