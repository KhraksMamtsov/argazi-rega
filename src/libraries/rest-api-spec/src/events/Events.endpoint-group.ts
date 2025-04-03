import { CreateEventEndpoint } from "./create/CreateEvent.endpoint.js";
import { GetEventEndpoint } from "./get/GetEvent.endpoint.js";
import { HttpApiGroup } from "@effect/platform";

export const EventsEndpointGroup = HttpApiGroup.make("Event")
  .add(GetEventEndpoint)
  .add(CreateEventEndpoint);
