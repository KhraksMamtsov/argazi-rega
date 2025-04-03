import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { GetPlacesHandlerLive } from "./get/GetPlaces.handler.js";
import { GetPlaceByIdHandlerLive } from "./get/GetPlacesById.handler.js";
import { CreatePlaceHandlerLive } from "./create/CreatePlace.handler.js";
import { GetPlaceSubscriptionsHandlerLive } from "./_subscriptions/GetPlaceSubscriptions.handler.js";
import { GetPlaceActualEventsHandlerLive } from "./_subscriptions/GetPlaceActualEvents.handler.js";
import { GetPlaceGeoPointHandlerLive } from "./_geo-points/GetPlaceGeoPoint.handler.js";

export const PlaceGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Place",
  (handlers) =>
    handlers
      .handle("getPlaces", GetPlacesHandlerLive)
      .handle("getPlaceById", GetPlaceByIdHandlerLive)
      .handle("createPlace", CreatePlaceHandlerLive)
      .handle("getPlaceActualEvents", GetPlaceActualEventsHandlerLive)
      .handle("getPlaceSubscriptions", GetPlaceSubscriptionsHandlerLive)
      .handle("getPlaceGeoPoint", GetPlaceGeoPointHandlerLive)
);
