import { HttpApiGroup } from "@effect/platform";
import { GetPlaceGeoPointEndpoint } from "./_geo-points/GetPlaceGeoPoint.endpoint.js";
import { GetPlaceActualEventsEndpoint } from "./_subscriptions/GetPlaceActualEvents.endpoint.js";
import { GetPlaceSubscriptionsEndpoint } from "./_subscriptions/GetPlaceSubscriptions.endpoint.js";
import { CreatePlaceEndpoint } from "./create/CreatePlace.endpoint.js";
import { GetPlacesEndpoint } from "./get/GetPlaces.endpoint.js";
import { GetPlaceByIdEndpoint } from "./get/GetPlacesById.endpoint.js";

export const PlacesEndpointGroup = HttpApiGroup.make("Place")
  .add(CreatePlaceEndpoint)
  .add(GetPlaceByIdEndpoint)
  .add(GetPlacesEndpoint)
  .add(GetPlaceSubscriptionsEndpoint)
  .add(GetPlaceActualEventsEndpoint)
  .add(GetPlaceGeoPointEndpoint);
