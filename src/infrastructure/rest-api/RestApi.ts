import { Schema } from "@effect/schema";
import { pipe } from "effect";
import { Api } from "effect-http";

import { AuthenticationEndpointGroup } from "./authentication/Authentication.endpoint-group.js";
import { EventsEndpointGroup } from "./events/Events.endpoint-group.js";
import { GeoPointsEndpointGroup } from "./geo-points/GeoPoints.endpoint-group.js";
import { MyEndpointsGroup } from "./my/My.endpoints-group.js";
import { PlacesEndpointGroup } from "./places/Places.endpoints-group.js";
import { SubscriptionsApiGroup } from "./subscriptions/Subscriptions.api-group.js";
import { TransportsEndpointGroup } from "./transports/Transports.endpoint-group.js";
import { UsersEndpointsGroup } from "./users/Users.endpoints-group.js";

export const RestApi = pipe(
	Api.api({
		description: "**Этот раздел понимает Markdown**",
		title: "Argazi Rega",
		version: "1.0.0",
	}),
	Api.addGroup(AuthenticationEndpointGroup),
	Api.addGroup(MyEndpointsGroup),
	Api.addGroup(UsersEndpointsGroup),
	Api.addGroup(GeoPointsEndpointGroup),
	Api.addGroup(EventsEndpointGroup),
	Api.addGroup(TransportsEndpointGroup),
	Api.addGroup(PlacesEndpointGroup),
	Api.addGroup(SubscriptionsApiGroup),
	Api.addGroup(
		Api.apiGroup("healthcheck").pipe(
			Api.get("healthcheckPing", "/healthcheck/ping", {
				response: Schema.literal("pong"),
			})
		)
	)
);
