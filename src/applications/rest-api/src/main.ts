import { HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Effect, flow, Layer, Logger, LogLevel, pipe } from "effect";
import { Middlewares, RouterBuilder } from "effect-http";
import { NodeServer } from "effect-http-node";

import { PrismaServiceTag } from "@argazi/database";
import { NotificationServiceLive } from "@argazi/message-broker";

import { JwtServiceTag } from "./authentication/Jwt.service.js";
import { LoginBasicHandler } from "./authentication/login-basic/LoginBasic.handler.js";
import { LoginDwbnHandler } from "./authentication/login-dwbn/LoginDwbn.handler.js";
import { RefreshTokenHandler } from "./authentication/refresh-token/RefreshToken.handler.js";
import { CreateTransportHandler } from "./transports/CreateTransport.handler.js";
import { GetVisitorHandler } from "./visitors/get/GetVisitor.handler.js";
import { CreateEventHandler } from "./events/create/CreateEvent.handler.js";
import { GetEventHandler } from "./events/get/GetEvent.handler.js";
import { GetSubscriptionByIdHandler } from "./subscriptions/get/GetSubscriptionById.handler.js";
import { CreateGeoPointHandler } from "./geo-points/CreateGeoPoint.handler.js";
import { CreateUsersVisitorHandler } from "./users/_visitors/CreateUsersVisitor.handler.js";
import { CreatePlaceHandler } from "./places/create/CreatePlace.handler.js";
import { GetPlaceByIdHandler } from "./places/get/GetPlacesById.handler.js";
import { GetPlaceGeoPointHandler } from "./places/_geo-points/GetPlaceGeoPoint.handler.js";
import { GetPlacesHandler } from "./places/get/GetPlaces.handler.js";
import { GetPlaceSubscriptionsHandler } from "./places/_subscriptions/GetPlaceSubscriptions.handler.js";
import { GetPlaceActualEventsHandler } from "./places/_subscriptions/GetPlaceActualEvents.handler.js";
import { CreateUserHandler } from "./users/create/CreateUser.handler.js";
import { UpdateUserHandler } from "./users/update/UpdateUser.handler.js";
import { GetUserHandler } from "./users/get/GetUser.handler.js";
import { GetUserSubscriptionsHandler } from "./users/_subscriptions/GetUserSubscriptions.handler.js";
import { CreateUserSubscriptionHandler } from "./users/_subscriptions/CreateUserSubscription.handler.js";
import { DeleteUserSubscriptionHandler } from "./users/_subscriptions/DeleteUserSubscription.handler.js";
import { GetManyUsersHandler } from "./users/get-many/GetManyUsers.handler.js";
import { BookTicketHandler } from "./users/_tickets/BookTicket.handler.js";
import { ReturnTicketHandler } from "./users/_tickets/ReturnTicketOnEvent.handler.js";
import { GetUserTicketByIdHandler } from "./users/_tickets/GetUserTicketById.handler.js";
import { GetMyIdentityHandler } from "./my/GetMyIdentity.handler.js";
import { CreateMyVisitorHandler } from "./my/_visitors/CreateMyVisitor.handler.js";
import { GetMyVisitorsHandler } from "./my/_visitors/GetMyVisitors.handler.js";
import { DeleteMyVisitorHandler } from "./my/_visitors/DeleteMyVisitor.handler.js";
import { ReturnMyTicketHandler } from "./my/_tickets/ReturnMyTicket.handler.js";
import { GetMyTicketsHandler } from "./my/_tickets/GetMyTickets.handler.js";
import { BookMyTicketHandler } from "./my/_tickets/BookMyTicket.handler.js";
import { GetMyTicketByIdHandler } from "./my/_tickets/GetMyTicketById.handler.js";
import { GetMySubscriptionsHandler } from "./my/_subscriptions/GetMySubscriptions.handler.js";
import { DeleteMySubscriptionHandler } from "./my/_subscriptions/DeleteMySubscription.handler.js";
import { CreateMySubscriptionHandler } from "./my/_subscriptions/CreateMySubscription.handler.js";
import { NotificationServiceTag } from "@argazi/domain";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const debugLogger = pipe(
  Logger.pretty,
  Layer.merge(Logger.minimumLogLevel(LogLevel.All))
);

const app = pipe(
  RouterBuilder.make(RestApiSpec, { parseOptions: { errors: "all" } }),
  // #region Authentications handlers
  flow(
    RouterBuilder.handle(LoginDwbnHandler),
    RouterBuilder.handle(LoginBasicHandler),
    RouterBuilder.handle(RefreshTokenHandler)
  ),
  // #endregion
  // #region Users handlers
  flow(
    RouterBuilder.handle(CreateUsersVisitorHandler),
    RouterBuilder.handle(CreateUserHandler),
    RouterBuilder.handle(UpdateUserHandler),
    RouterBuilder.handle(GetUserHandler),
    RouterBuilder.handle(GetUserSubscriptionsHandler),
    RouterBuilder.handle(CreateUserSubscriptionHandler),
    RouterBuilder.handle(DeleteUserSubscriptionHandler),
    RouterBuilder.handle(GetManyUsersHandler)
  ),
  flow(
    RouterBuilder.handle(BookTicketHandler),
    RouterBuilder.handle(ReturnTicketHandler),
    RouterBuilder.handle(GetUserTicketByIdHandler)
  ),
  // #endregion
  // #region Transport handlers
  RouterBuilder.handle(CreateTransportHandler),
  // #endregion

  // #region Event
  flow(
    RouterBuilder.handle(CreateEventHandler),
    RouterBuilder.handle(GetEventHandler)
  ),
  // #endregion

  // #region Place
  flow(
    RouterBuilder.handle(CreatePlaceHandler),
    RouterBuilder.handle(GetPlaceByIdHandler),
    RouterBuilder.handle(GetPlaceGeoPointHandler),
    RouterBuilder.handle(GetPlacesHandler),
    RouterBuilder.handle(GetPlaceSubscriptionsHandler),
    RouterBuilder.handle(GetPlaceActualEventsHandler)
  ),
  // #endregion

  // #region Subscriptions handlers
  RouterBuilder.handle(GetSubscriptionByIdHandler),
  // #endregion
  // #region GeoPoints handlers
  RouterBuilder.handle(CreateGeoPointHandler),
  // #endregion
  // #region My handlers
  flow(
    RouterBuilder.handle(GetMyIdentityHandler),
    RouterBuilder.handle(GetMySubscriptionsHandler),
    RouterBuilder.handle(DeleteMySubscriptionHandler),
    RouterBuilder.handle(CreateMySubscriptionHandler),
    RouterBuilder.handle(GetMyTicketByIdHandler),
    RouterBuilder.handle(ReturnMyTicketHandler),
    RouterBuilder.handle(GetMyTicketsHandler),
    RouterBuilder.handle(BookMyTicketHandler),
    flow(
      RouterBuilder.handle(CreateMyVisitorHandler),
      RouterBuilder.handle(GetMyVisitorsHandler),
      RouterBuilder.handle(DeleteMyVisitorHandler)
    )
  ),
  // #endregion
  // #region Visitor
  flow(RouterBuilder.handle(GetVisitorHandler)),
  // #endregion
  // #region Healthcheck handlers
  RouterBuilder.handle("healthCheckPing", (x) =>
    Effect.gen(function* () {
      const result = x.query.echo ?? "pong";

      yield* Effect.all([
        //
        NotificationServiceTag.healthCheck,
        PrismaServiceTag.queryRaw`SELECT 1`,
      ]);

      return result;
    }).pipe(Effect.tap(Effect.logDebug))
  )
  // #endregion
);

pipe(
  RouterBuilder.build(app),
  Middlewares.accessLog(LogLevel.All),
  Middlewares.errorLog,
  NodeServer.listen({ port: 80 }),
  Effect.provide(debugLogger),
  Effect.provide(PrismaServiceTag.Live),
  Effect.provide(NotificationServiceLive),
  Effect.provide(HttpClient.layer),
  Effect.provide(JwtServiceTag.Live),
  Effect.scoped,
  NodeRuntime.runMain
);
