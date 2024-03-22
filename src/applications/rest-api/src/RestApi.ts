import { Schema } from "@effect/schema";
import { Api, ApiGroup, ApiEndpoint } from "effect-http";

import { AuthenticationEndpointGroup } from "./authentication/Authentication.endpoint-group.js";
import { EventsEndpointGroup } from "./events/Events.endpoint-group.js";
import { GeoPointsEndpointGroup } from "./geo-points/GeoPoints.endpoint-group.js";
import { MyEndpointsGroup } from "./my/My.endpoints-group.js";
import { PlacesEndpointGroup } from "./places/Places.endpoints-group.js";
import { SubscriptionsApiGroup } from "./subscriptions/Subscriptions.api-group.js";
import { TransportsEndpointGroup } from "./transports/Transports.endpoint-group.js";
import { UsersEndpointsGroup } from "./users/Users.endpoints-group.js";

export { Api, ApiGroup, ApiEndpoint };

export const RestApi = Api.make({
  description: "**Этот раздел понимает Markdown**",
  title: "Argazi Rega",
  version: "1.0.0",
}).pipe(
  Api.addGroup(AuthenticationEndpointGroup),
  Api.addGroup(MyEndpointsGroup),
  Api.addGroup(UsersEndpointsGroup),
  Api.addGroup(GeoPointsEndpointGroup),
  Api.addGroup(EventsEndpointGroup),
  Api.addGroup(TransportsEndpointGroup),
  Api.addGroup(PlacesEndpointGroup),
  Api.addGroup(SubscriptionsApiGroup),
  Api.addGroup(
    ApiGroup.make("healthcheck").pipe(
      ApiGroup.addEndpoint(
        ApiEndpoint.get("healthcheckPing", "/healthcheck/ping", {}).pipe(
          ApiEndpoint.setRequestQuery(
            Schema.struct({ echo: Schema.optional(Schema.string) })
          ),
          ApiEndpoint.setResponseBody(Schema.string)
        )
      )
    )
  )
);

type asd = typeof RestApi;
export interface RestApi extends asd {}
