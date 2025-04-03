import {
  HttpApiBuilder,
  HttpApiScalar,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import {
  NodeHttpClient,
  NodeHttpServer,
  NodeRuntime,
} from "@effect/platform-node";

import { NotificationServiceLive } from "@argazi/message-broker";
import { Layer } from "effect";

import { PrismaServiceTag } from "@argazi/database";

import { TransportGroupHandlerLive } from "./transports/Transport.group-handler.js";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { createServer } from "node:http";
import { VisitorGroupHandlerLive } from "./visitors/get/GetVisitor.handler.js";
import { UserGroupHandlerLive } from "./users/User.group-handler.js";
import { BearerAuthenticationLive } from "./_security/BearerAuth.security.js";
import { BasicAuthenticationLive } from "./_security/BasicAuth.security.js";
import { JwtServiceTag } from "./authentication/Jwt.service.js";
import { AuthenticationGroupHandlerLive } from "./authentication/Authentication.group-handler.js";
import { GeoPointGroupHandlerLive } from "./geo-points/GeoPoint.group-handler.js";
import { PlaceGroupHandlerLive } from "./places/Place.group-handler.js";
import { EventGroupHandlerLive } from "./events/Event.group-handler.js";
import { MyGroupHandlerLive } from "./my/My.group-handler.js";
import { SubscriptionGroupHandlerLive } from "./subscriptions/Subscription.group-handler.js";
import { HealthCheckGroupHandlerLive } from "./healthcheck/Healthcheck.group-handler.js";

const RestApiLive = HttpApiBuilder.api(RestApiSpec).pipe(
  Layer.provide(TransportGroupHandlerLive),
  Layer.provide(VisitorGroupHandlerLive),
  Layer.provide(UserGroupHandlerLive),
  Layer.provide(AuthenticationGroupHandlerLive),
  Layer.provide(GeoPointGroupHandlerLive),
  Layer.provide(EventGroupHandlerLive),
  Layer.provide(PlaceGroupHandlerLive),
  Layer.provide(MyGroupHandlerLive),
  Layer.provide(SubscriptionGroupHandlerLive),
  Layer.provide(HealthCheckGroupHandlerLive)
);

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(
    HttpApiBuilder.middlewareOpenApi({ path: "/docs/openapi.json" })
  ),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs/swagger" })),
  Layer.provide(HttpApiScalar.layer({ source: { type: "cdn" } })),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(RestApiLive),
  Layer.provide(BasicAuthenticationLive),
  Layer.provide(BearerAuthenticationLive),
  Layer.provide(PrismaServiceTag.Live),
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.provide(NotificationServiceLive),
  Layer.provide(JwtServiceTag.Live),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
