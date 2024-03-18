import { ApiGroup, ApiEndpoint } from "effect-http";

import { GetPlaceGeoPoint } from "./_geo-points/GetPlaceGeoPoint.endpoint.js";
import * as GetPlaceActualEvents from "./_subscriptions/GetPlaceActualEvents.endpoint.js";
import * as GetPlaceSubscriptions from "./_subscriptions/GetPlaceSubscriptions.endpoint.js";
import * as CreatePlacesEndpoint from "./create/Places.api.js";
import { GetPlacesEndpoint } from "./get/GetPlaces.endpoint.js";
import { GetPlaceByIdEndpoint } from "./get/GetPlacesById.endpoint.js";

export const PlacesEndpointGroup = ApiGroup.make("place").pipe(
	ApiEndpoint.post("createPlace", "/places", {
		request: CreatePlacesEndpoint.CreatePlaceRequest,
		response: CreatePlacesEndpoint.CreatePlaceResponseSchema,
	}),
	GetPlaceByIdEndpoint,
	GetPlacesEndpoint,
	ApiEndpoint.get("getPlaceSubscriptions", "/places/:idPlace/subscriptions", {
		request: GetPlaceSubscriptions.GetPlaceSubscriptionsRequest,
		response: GetPlaceSubscriptions.GetPlaceSubscriptionsResponse,
	}),
	ApiEndpoint.get("getPlaceActualEvents", "/places/:idPlace/actual-events", {
		request: GetPlaceActualEvents.GetPlaceActualEventsRequest,
		response: GetPlaceActualEvents.GetPlaceActualEventsResponse,
	}),
	GetPlaceGeoPoint
);
