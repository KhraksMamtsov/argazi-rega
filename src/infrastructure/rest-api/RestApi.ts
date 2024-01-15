import { Schema } from "@effect/schema";
import { pipe } from "effect";
import { Api, SecurityScheme } from "effect-http";

import * as AuthBasicEndpoint from "./authentication/login-basic/LoginBasic.endpoint.js";
import * as AuthDwbnEndpoint from "./authentication/login-dwbn/LoginDwbn.api.js";
import * as AuthRefreshEndpoint from "./authentication/refresh-token/RefreshToken.api.js";
import { BearerAuth } from "./BearerAuth.security-scheme.js";
import * as CreateEventEndpoint from "./events/create/Event.api.js";
import * as GetEventEndpoint from "./events/get/Events.api.js";
import * as GeoPointEndpoint from "./geo-points/CreateGeoPoint.endpoint.js";
import { MyEndpointsGroup } from "./my/My.endpoints-group.js";
import { PlacesEndpointGroup } from "./places/Places.endpoints-group.js";
import { SubscriptionsApiGroup } from "./subscriptions/Subscriptions.api-group.js";
import * as TransportsEndpoint from "./transports/CreateTransport.endpoint.js";
import { UsersEndpointsGroup } from "./users/Users.endpoints-group.js";

export const RestApi = pipe(
	Api.api({
		description: "**Этот раздел понимает Markdown**",
		title: "Argazi Rega",
		version: "1.0.0",
	}),
	Api.addGroup(
		Api.apiGroup("authentication").pipe(
			Api.post("loginDwbn", "/authentication/login-dwbn", {
				request: AuthDwbnEndpoint.LoginDwbnRequest,
				response: AuthDwbnEndpoint.LoginDwbnResponse,
			}),
			Api.post(
				"loginBasic",
				"/authentication/login-basic",
				{
					response: AuthBasicEndpoint.LoginBasicResponse,
				},
				{
					security: {
						basic: SecurityScheme.basic({
							tokenSchema: Schema.Secret,
						}),
					},
				}
			),
			Api.post("refreshAuthentication", "/authentication/refresh", {
				request: AuthRefreshEndpoint.RefreshTokenRequestSchema,
				response: AuthRefreshEndpoint.RefreshTokenResponse,
			})
		)
	),

	Api.addGroup(MyEndpointsGroup),
	Api.addGroup(UsersEndpointsGroup),
	Api.addGroup(
		Api.apiGroup("geo-points").pipe(
			Api.post(
				"createGeoPoint",
				"/geo-points",
				{
					request: GeoPointEndpoint.CreateGeoPointRequest,
					response: GeoPointEndpoint.CreateGeoPointResponseSchema,
				},
				{
					security: BearerAuth,
				}
			)
		)
	),
	Api.addGroup(
		Api.apiGroup("event").pipe(
			Api.post("createEvent", "/events", {
				request: CreateEventEndpoint.CreateEventRequest,
				response: CreateEventEndpoint.CreateEventResponseSchema,
			}),
			Api.get("getEvent", "/events/:idEvent", {
				request: GetEventEndpoint.GetEventRequest,
				response: GetEventEndpoint.GetEventResponse,
			})
		)
	),
	Api.addGroup(
		Api.apiGroup("transport").pipe(
			Api.post("createTransport", "/transports", {
				request: TransportsEndpoint.CreateTransportRequest,
				response: TransportsEndpoint.CreateTransportResponseSchema,
			})
		)
	),
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
