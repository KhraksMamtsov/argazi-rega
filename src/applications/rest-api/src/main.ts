import { HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Effect, flow, Layer, Logger, LogLevel, pipe } from "effect";
import { RouterBuilder, HttpError } from "effect-http";
import { NodeServer } from "effect-http-node";
import { PrettyLogger } from "effect-log";

import {
  CreateSubscriptionUseCase,
  DeleteUserSubscriptionUseCase,
  GetUserSubscriptionsUseCase,
  BookTicketUseCase,
  GetUserTicketByIdUseCase,
  GetUserTicketsUseCase,
  ReturnTicketUseCase,
  CreateUserUseCase,
  GetUserUseCase,
  GetManyUsersUseCase,
  UpdateUserUseCase,
  CreateUsersVisitorUseCase,
  GetUsersVisitorsUseCase,
  DeleteUsersVisitorUseCase,
} from "@argazi/application";
import { PrismaServiceTag } from "@argazi/database";
import { NotificationServiceLive } from "@argazi/message-broker";

import { IdAdmin } from "./authentication/constants.js";
import { JwtServiceTag } from "./authentication/Jwt.service.js";
import { LoginBasicHandler } from "./authentication/login-basic/LoginBasic.handler.js";
import { LoginDwbnHandler } from "./authentication/login-dwbn/LoginDwbn.handler.js";
import { RefreshTokenHandler } from "./authentication/refresh-token/RefreshToken.handler.js";
import { BearerAuthGuard } from "./BearerAuth.guard.js";
import { RestApiSpec } from "./RestApiSpec.js";
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

export const debugLogger = pipe(
  PrettyLogger.layer(),
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
    RouterBuilder.handle("createUser", ({ body }) =>
      Effect.gen(function* () {
        const newUser = yield* CreateUserUseCase({
          idInitiator: IdAdmin,
          payload: body,
        });

        return newUser;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("updateUser", ({ body, path }) =>
      Effect.gen(function* () {
        const newUser = yield* UpdateUserUseCase({
          idInitiator: IdAdmin,
          payload: { id: path.id, ...body },
        });

        return newUser;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getUser", ({ path }) =>
      Effect.gen(function* () {
        const newUser = yield* pipe(
          GetUserUseCase({
            payload: { id: path.idUser, type: "id" },
          }),
          Effect.flatten,
          Effect.mapError(() => HttpError.notFound("NotFound1"))
        );

        return newUser;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getManyUsers", ({ body }) =>
      Effect.gen(function* () {
        if (body.idsUser === undefined) {
          return [];
        }

        const newUserOption = yield* GetManyUsersUseCase({
          payload: { idsUser: body.idsUser, type: "id" },
        });

        return newUserOption;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),

    RouterBuilder.handle("getUserSubscriptions", ({ path }) =>
      Effect.gen(function* () {
        const content = yield* GetUserSubscriptionsUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            idUser: path.idUser,
          },
        });

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("createUserSubscription", ({ path, body }) =>
      Effect.gen(function* () {
        const content = yield* CreateSubscriptionUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            idPlace: body.idPlace,
            idUser: path.idUser,
          },
        });

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("deleteUserSubscription", ({ path }) =>
      Effect.gen(function* () {
        const content = yield* DeleteUserSubscriptionUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            idSubscription: path.idSubscription,
            idUser: path.idUser,
          },
        });

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    )
  ),
  flow(
    RouterBuilder.handle("bookTicket", ({ path, body }) =>
      Effect.gen(function* () {
        const result = yield* BookTicketUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            idEvent: body.idEvent,
            idUser: path.idUser,
          },
        });

        return result;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("returnTicket", ({ path }) =>
      Effect.gen(function* () {
        const content = yield* ReturnTicketUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            id: path.idTicket,
            idUser: path.idUser,
          },
        });

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getUserTicketById", ({ path }) =>
      Effect.gen(function* () {
        const ticket = yield* pipe(
          GetUserTicketByIdUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idTicket: path.idTicket,
              idUser: path.idUser,
            },
          }),
          Effect.flatten,
          Effect.tapError(Effect.logError),
          Effect.mapError(() => HttpError.notFound("NotFound2"))
        );

        return ticket;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    )
  ),
  // #endregion
  // #region Transport handlers
  RouterBuilder.handle(CreateTransportHandler),
  // #endregion

  // #region Event
  RouterBuilder.handle(CreateEventHandler),
  RouterBuilder.handle(GetEventHandler),
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
    RouterBuilder.handle(
      "getMyIdentity",
      BearerAuthGuard((_, { idInitiator }) => {
        const user = GetUserUseCase({
          payload: {
            id: idInitiator,
            type: "id",
          },
        }).pipe(
          Effect.flatten,
          Effect.mapError(() => HttpError.notFound("NotFound2"))
        );

        return user;
      })
    ),
    RouterBuilder.handle(
      "getMySubscriptions",
      BearerAuthGuard((_, { idInitiator }) =>
        GetUserSubscriptionsUseCase({
          idInitiator,
          payload: {
            idUser: idInitiator,
          },
        })
      )
    ),
    RouterBuilder.handle(
      "deleteMySubscription",
      BearerAuthGuard(({ path }, { idInitiator }) =>
        DeleteUserSubscriptionUseCase({
          idInitiator,
          payload: {
            idSubscription: path.idSubscription,
            idUser: idInitiator,
          },
        })
      )
    ),
    RouterBuilder.handle(
      "createMySubscription",
      BearerAuthGuard((input, { idInitiator }) =>
        CreateSubscriptionUseCase({
          idInitiator,
          payload: {
            idPlace: input.body.idPlace,
            idUser: idInitiator,
          },
        })
      )
    ),
    RouterBuilder.handle(
      "getMyTicketById",
      BearerAuthGuard((input, { idInitiator }) =>
        GetUserTicketByIdUseCase({
          idInitiator,
          payload: {
            idTicket: input.path.idTicket,
            idUser: idInitiator,
          },
        }).pipe(
          Effect.flatten,
          Effect.tapError(Effect.logError),
          Effect.mapError(() => HttpError.notFound("NotFound2"))
        )
      )
    ),
    RouterBuilder.handle(
      "returnMyTicket",
      BearerAuthGuard((input, { idInitiator }) =>
        ReturnTicketUseCase({
          idInitiator,
          payload: {
            id: input.path.idTicket,
            idUser: idInitiator,
          },
        })
      )
    ),
    RouterBuilder.handle(
      "getMyTickets",
      BearerAuthGuard((_, { idInitiator }) =>
        GetUserTicketsUseCase(
          {
            idInitiator,
            payload: { idUser: idInitiator },
          },
          { includeDeleted: false }
        )
      )
    ),
    RouterBuilder.handle(
      "bookMyTicket",
      BearerAuthGuard((input, { idInitiator }) =>
        BookTicketUseCase({
          idInitiator,
          payload: {
            idEvent: input.body.idEvent,
            idUser: idInitiator,
          },
        })
      )
    ),
    flow(
      RouterBuilder.handle(
        "createMyVisitor",
        BearerAuthGuard(({ body }, { idInitiator }) =>
          CreateUsersVisitorUseCase({
            idInitiator,
            payload: {
              email: body.email,
              idUser: idInitiator,
              name: body.name,
              type: body.type,
            },
          })
        )
      ),
      RouterBuilder.handle(
        "getMyVisitors",
        BearerAuthGuard((_, { idInitiator }) =>
          GetUsersVisitorsUseCase(
            {
              idInitiator,
              payload: {
                idUser: idInitiator,
              },
            },
            { includeDeleted: false }
          )
        )
      ),
      RouterBuilder.handle(
        "deleteMyVisitor",
        BearerAuthGuard(({ path }, { idInitiator }) =>
          DeleteUsersVisitorUseCase({
            idInitiator,
            payload: {
              id: path.idVisitor,
              idUser: idInitiator,
            },
          })
        )
      )
    )
  ),
  // #endregion
  // #region Visitor
  flow(RouterBuilder.handle(GetVisitorHandler)),
  // #endregion
  // #region Healthcheck handlers
  RouterBuilder.handle("healthCheckPing", (x) =>
    Effect.succeed(x.query.echo ?? "pong").pipe(Effect.tap(Effect.logDebug))
  )
  // #endregion
);

pipe(
  RouterBuilder.build(app),
  NodeServer.listen({ port: 80 }),
  Effect.provide(debugLogger),
  Effect.provide(PrismaServiceTag.Live()),
  Effect.provide(NotificationServiceLive),
  Effect.provide(HttpClient.layer),
  Effect.provide(JwtServiceTag.Live),
  Effect.scoped,
  NodeRuntime.runMain
);
