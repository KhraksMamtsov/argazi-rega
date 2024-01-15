import { Api } from "effect-http";

import { GetPlaceGeoPoint } from "./_geo-points/GetPlaceGeoPoint.endpoint.js";
import * as GetPlaceActualEvents from "./_subscriptions/GetPlaceActualEvents.endpoint.js";
import * as GetPlaceSubscriptions from "./_subscriptions/GetPlaceSubscriptions.endpoint.js";
import * as CreatePlacesEndpoint from "./create/Places.api.js";
import { GetPlacesEndpoint } from "./get/GetPlaces.endpoint.js";
import { GetPlaceByIdEndpoint } from "./get/GetPlacesById.endpoint.js";

export const PlacesEndpointGroup = Api.apiGroup("place").pipe(
	Api.post("createPlace", "/places", {
		request: CreatePlacesEndpoint.CreatePlaceRequest,
		response: CreatePlacesEndpoint.CreatePlaceResponseSchema,
	}),
	GetPlaceByIdEndpoint,
	GetPlacesEndpoint,
	Api.get("getPlaceSubscriptions", "/places/:idPlace/subscriptions", {
		request: GetPlaceSubscriptions.GetPlaceSubscriptionsRequest,
		response: GetPlaceSubscriptions.GetPlaceSubscriptionsResponse,
	}),
	Api.get("getPlaceActualEvents", "/places/:idPlace/actual-events", {
		request: GetPlaceActualEvents.GetPlaceActualEventsRequest,
		response: GetPlaceActualEvents.GetPlaceActualEventsResponse,
	}),
	GetPlaceGeoPoint
);
