import { ApiGroup } from "effect-http";

import { GetPlaceGeoPoint } from "./_geo-points/GetPlaceGeoPoint.endpoint.js";
import { GetPlaceActualEventsEndpoint } from "./_subscriptions/GetPlaceActualEvents.endpoint.js";
import { GetPlaceSubscriptionsEndpoint } from "./_subscriptions/GetPlaceSubscriptions.endpoint.js";
import { CreatePlaceEndpoint } from "./create/Places.api.js";
import { GetPlacesEndpoint } from "./get/GetPlaces.endpoint.js";
import { GetPlaceByIdEndpoint } from "./get/GetPlacesById.endpoint.js";

export const PlacesEndpointGroup = ApiGroup.make("place").pipe(
  ApiGroup.addEndpoint(CreatePlaceEndpoint),
  ApiGroup.addEndpoint(GetPlaceByIdEndpoint),
  ApiGroup.addEndpoint(GetPlacesEndpoint),
  ApiGroup.addEndpoint(GetPlaceSubscriptionsEndpoint),
  ApiGroup.addEndpoint(GetPlaceActualEventsEndpoint),
  ApiGroup.addEndpoint(GetPlaceGeoPoint)
);
