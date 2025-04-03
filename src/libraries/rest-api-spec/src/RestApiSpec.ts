import { EventsEndpointGroup } from "./events/Events.endpoint-group.js";
import { TransportsEndpointGroup } from "./transports/Transports.endpoint-group.js";
import { UsersEndpointsGroup } from "./users/Users.endpoints-group.js";

import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  OpenApi,
} from "@effect/platform";
import { VisitorsEndpointsGroup } from "./visitors/Visitors.endpoints-group.js";
import { SubscriptionsApiGroup } from "./subscriptions/Subscriptions.api-group.js";
import { PlacesEndpointGroup } from "./places/Places.endpoints-group.js";
import { GeoPointsEndpointGroup } from "./geo-points/GeoPoints.endpoint-group.js";
import { Effect, Schema } from "effect";
import { MyEndpointsGroup } from "./my/My.endpoints-group.js";
import { HttpApiUnexpectedServerError } from "./HttpApiError.js";
// import { HttpApiUnauthorizedError } from "./HttpApiError.js";
import { AuthenticationEndpointGroup } from "./authentication/Authentication.endpoint-group.js";

export const RestApiSpec = HttpApi.make("RestApiSpec")
  // .add(_TransportsEndpointGroup.addError(HttpApiUnauthorizedError))
  .annotateContext(
    OpenApi.annotations({
      description: "**Этот раздел понимает Markdown**",
      title: "Argazi Rega",
      version: "1.0.0",
    })
  )
  .add(AuthenticationEndpointGroup)
  .add(GeoPointsEndpointGroup)
  .add(PlacesEndpointGroup)
  .add(TransportsEndpointGroup)
  .add(VisitorsEndpointsGroup)
  .add(SubscriptionsApiGroup)
  .add(EventsEndpointGroup)
  .add(UsersEndpointsGroup)
  .add(MyEndpointsGroup)
  .add(
    HttpApiGroup.make("HealthCheck")
      .annotate(Summary, "summ")
      .annotate(Description, "desc")
      .annotate(ExternalDocs, {
        url: "https://qwe.qwe.asd",
        description: "ExternalDocs qweqweqweqweqwe",
      })
      .add(
        HttpApiEndpoint.get("healthCheckPing", "/health-check/ping")
          .setUrlParams(
            Schema.Struct({
              echo: Schema.optional(Schema.String),
            })
          )
          .addSuccess(Schema.String)
          .annotate(Summary, "summ")
          .annotate(Description, "desc")
      )
  )
  .addError(HttpApiUnexpectedServerError, { status: 500 });

// export const RestApiSpec = Api.make({
// }).pipe(
//   Api.addGroup(AuthenticationEndpointGroup),
//   Api.addGroup(MyEndpointsGroup),
// );

import { HttpApiClient } from "@effect/platform";
import { Description, ExternalDocs, Summary } from "@effect/platform/OpenApi";

Effect.gen(function* () {
  const client = yield* HttpApiClient.make(RestApiSpec, {
    baseUrl: "http://localhost:3000",
    // You can transform the HttpClient to add things like authentication
    // transformClient: ....
  });
  const user = yield* client.Authentication.loginBasic();
  user.accessToken;
  yield* Effect.log(user);
});
