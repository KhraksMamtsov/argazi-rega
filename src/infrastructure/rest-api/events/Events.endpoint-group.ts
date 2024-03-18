import { ApiGroup } from "effect-http";

import { CreateEventEndpoint } from "./create/CreateEvent.endpoint.js";
import { GetEventEndpoint } from "./get/GetEvent.endpoint.js";

export const EventsEndpointGroup = ApiGroup.make("event").pipe(
	ApiGroup.addEndpoint(GetEventEndpoint),
	ApiGroup.addEndpoint(CreateEventEndpoint)
);
