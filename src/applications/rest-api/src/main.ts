import { HttpClient } from "@effect/platform";
import { runMain } from "@effect/platform-node/NodeRuntime";
import {
  Effect,
  flow,
  Layer,
  Logger,
  LogLevel,
  Option,
  pipe,
  Secret,
} from "effect";
import { RouterBuilder, ServerError } from "effect-http";
import { isServerError } from "effect-http/ServerError";
import { NodeServer } from "effect-http-node";
import { PrettyLogger } from "effect-log";

import {
  CreateEventUseCase,
  GetEventByIdUseCase,
  CreateGeoPointUseCase,
  GetPlaceGeoPointUseCase,
  GetPlaceActualEventsUseCase,
  GetPlaceSubscriptionsUseCase,
  CreatePlaceUseCase,
  GetPlaceByIdUseCase,
  GetPlacesUseCase,
  CreateSubscriptionUseCase,
  GetSubscriptionByIdUseCase,
  CreateTransportUseCase,
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

export const debugLogger = pipe(
  PrettyLogger.layer(),
  Layer.merge(Logger.minimumLogLevel(LogLevel.All))
);

const app = pipe(
  RouterBuilder.make(RestApiSpec, { parseOptions: { errors: "all" } }),
  // region Authentications handlers
  flow(
    RouterBuilder.handle("loginDwbn", ({ body }) =>
      Effect.gen(function* (_) {
        const loginResult = yield* _(LoginDwbnHandler(body));

        return loginResult;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("loginBasic", (_, { pass, user }) =>
      Effect.gen(function* (_) {
        const loginResult = yield* _(
          LoginBasicHandler({
            login: Secret.fromString(user),
            password: Secret.fromString(pass),
          })
        );

        if (isServerError(loginResult)) {
          return yield* _(loginResult);
        }

        return loginResult;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("refreshToken", ({ body }) =>
      Effect.gen(function* (_) {
        const loginResult = yield* _(RefreshTokenHandler(body));

        if (Option.isNone(loginResult)) {
          return yield* _(
            ServerError.unauthorizedError({
              content: "User not found",
            })
          );
        }

        return loginResult.value;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    )
  ),
  // endregion
  flow(
    RouterBuilder.handle(
      "createUsersVisitor",
      BearerAuthGuard(({ body, path }, { idInitiator }) =>
        Effect.gen(function* (_) {
          const newVisitor = yield* _(
            CreateUsersVisitorUseCase({
              idInitiator,
              payload: {
                ...body,
                idUser: path.idUser,
              },
            })
          );

          return newVisitor;
        }).pipe(
          Effect.tapBoth({
            onFailure: Effect.logError,
            onSuccess: Effect.logInfo,
          })
        )
      )
    )
  ),
  // region Users handlers
  flow(
    RouterBuilder.handle("createUser", ({ body }) =>
      Effect.gen(function* (_) {
        const newUser = yield* _(
          CreateUserUseCase({
            idInitiator: IdAdmin,
            payload: body,
          })
        );

        return newUser;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("updateUser", ({ body, path }) =>
      Effect.gen(function* (_) {
        const newUser = yield* _(
          UpdateUserUseCase({
            idInitiator: IdAdmin,
            payload: { id: path.id, ...body },
          })
        );

        return newUser;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getUser", ({ path }) =>
      Effect.gen(function* (_) {
        const newUser = yield* _(
          GetUserUseCase({ payload: { id: path.idUser, type: "id" } }),
          Effect.flatten,
          Effect.mapError(() => ServerError.notFoundError("NotFound1"))
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
      Effect.gen(function* (_) {
        if (body.idsUser === undefined) {
          return [];
        }

        const newUserOption = yield* _(
          GetManyUsersUseCase({
            payload: { idsUser: body.idsUser, type: "id" },
          })
        );

        return newUserOption;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),

    RouterBuilder.handle("getUserSubscriptions", ({ path }) =>
      Effect.gen(function* (_) {
        const content = yield* _(
          GetUserSubscriptionsUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idUser: path.idUser,
            },
          })
        );

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("createUserSubscription", ({ path, body }) =>
      Effect.gen(function* (_) {
        const content = yield* _(
          CreateSubscriptionUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idPlace: body.idPlace,
              idUser: path.idUser,
            },
          })
        );

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("deleteUserSubscription", ({ path }) =>
      Effect.gen(function* (_) {
        const content = yield* _(
          DeleteUserSubscriptionUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idSubscription: path.idSubscription,
              idUser: path.idUser,
            },
          })
        );

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
      Effect.gen(function* (_) {
        const result = yield* _(
          BookTicketUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idEvent: body.idEvent,
              idUser: path.idUser,
            },
          })
        );

        return result;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("returnTicket", ({ path }) =>
      Effect.gen(function* (_) {
        const content = yield* _(
          ReturnTicketUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              id: path.idTicket,
              idUser: path.idUser,
            },
          })
        );

        return content;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getUserTicketById", ({ path }) =>
      Effect.gen(function* (_) {
        const ticket = yield* _(
          GetUserTicketByIdUseCase({
            idInitiator: path.idUser, // Todo: take from security
            payload: {
              idTicket: path.idTicket,
              idUser: path.idUser,
            },
          }),
          Effect.flatten,
          Effect.tapError(Effect.logError),
          Effect.mapError(() => ServerError.notFoundError("NotFound2"))
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
  // endregion
  // region Transport handlers
  RouterBuilder.handle("createTransport", ({ body }) =>
    Effect.gen(function* (_) {
      const newTransport = yield* _(
        CreateTransportUseCase({
          idInitiator: IdAdmin,
          payload: body,
        })
      );

      return newTransport;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
  ),
  // endregion
  // region Event handlers
  RouterBuilder.handle("createEvent", ({ body }) =>
    Effect.gen(function* (_) {
      const newEvent = yield* _(
        CreateEventUseCase({
          idInitiator: IdAdmin,
          payload: body,
        })
      );

      return newEvent;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
  ),
  RouterBuilder.handle("getEvent", ({ path }) =>
    Effect.gen(function* (_) {
      const newEventOption = yield* _(
        GetEventByIdUseCase({
          idInitiator: IdAdmin,
          payload: { id: path.idEvent },
        }),
        Effect.flatten,
        Effect.mapError(() => ServerError.notFoundError("NotFound3"))
      );

      return newEventOption;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
  ),
  // endregion
  // region Place handlers
  flow(
    RouterBuilder.handle("createPlace", ({ body }) =>
      Effect.gen(function* (_) {
        const newPlace = yield* _(
          CreatePlaceUseCase({
            idInitiator: IdAdmin,
            payload: body,
          })
        );

        return newPlace;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getPlaceById", ({ path }) =>
      Effect.gen(function* (_) {
        const newPlace = yield* _(
          GetPlaceByIdUseCase({
            idInitiator: IdAdmin,
            payload: { id: path.idPlace },
          }),
          Effect.flatten,
          Effect.mapError(() => ServerError.notFoundError("NotFound4"))
        );

        return newPlace;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getPlaceGeoPoint", ({ path }) =>
      Effect.gen(function* (_) {
        const geoPoint = yield* _(
          GetPlaceGeoPointUseCase({
            idInitiator: IdAdmin,
            payload: { idPlace: path.idPlace },
          }),
          Effect.flatten,
          Effect.mapError(() => ServerError.notFoundError("NotFound4"))
        );

        return geoPoint;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getPlaces", () =>
      Effect.gen(function* (_) {
        const places = yield* _(
          GetPlacesUseCase({
            idInitiator: IdAdmin,
            payload: {},
          })
        );

        return places;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),
    RouterBuilder.handle("getPlaceSubscriptions", ({ path }) =>
      Effect.gen(function* (_) {
        const placeSubscriptions = yield* _(
          GetPlaceSubscriptionsUseCase({
            idInitiator: IdAdmin,
            payload: { idPlace: path.idPlace },
          })
        );

        return placeSubscriptions;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    ),

    RouterBuilder.handle("getPlaceActualEvents", ({ path }) =>
      Effect.gen(function* (_) {
        const placeActualEvents = yield* _(
          GetPlaceActualEventsUseCase(
            {
              idInitiator: IdAdmin,
              payload: { idPlace: path.idPlace },
            },
            { includeDeleted: false }
          )
        );

        return placeActualEvents;
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        })
      )
    )
  ),
  // endregion
  // region Subscriptions handlers
  RouterBuilder.handle("getSubscription", ({ path }) =>
    Effect.gen(function* (_) {
      const subscriptionOption = yield* _(
        GetSubscriptionByIdUseCase({
          idInitiator: IdAdmin,
          payload: { idSubscription: path.idSubscription },
        }),
        Effect.tapError((x) => Effect.logError(x))
      );

      return yield* _(
        subscriptionOption.pipe(
          Option.match({
            onNone: () => ServerError.notFoundError("Not Found"),
            onSome: (subscription) => Effect.succeed(subscription),
          })
        )
      );
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
  ),
  // endregion
  // region GeoPoints handlers
  RouterBuilder.handle(
    "createGeoPoint",
    BearerAuthGuard(({ body }, { idInitiator }) =>
      Effect.gen(function* (_) {
        const qwe = yield* _(
          //  ^?
          CreateGeoPointUseCase({
            idInitiator,
            payload: body,
          })
        );

        return qwe;
      })
    )
  ),
  // endregion
  // region My handlers
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
          Effect.mapError(() => ServerError.notFoundError("NotFound2"))
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
          Effect.mapError(() => ServerError.notFoundError("NotFound2"))
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
    )
  ),
  // endregion
  // region Healthcheck handlers
  RouterBuilder.handle("healthCheckPing", (x) =>
    Effect.succeed(x.query.echo ?? "pong").pipe(Effect.tap(Effect.logDebug))
  )
  // endregion
);

pipe(
  RouterBuilder.build(app),
  NodeServer.listen({ port: 80 }),
  Effect.provide(debugLogger),
  Effect.provide(PrismaServiceTag.Live()),
  Effect.provide(NotificationServiceLive),
  Effect.provide(HttpClient.client.layer),
  Effect.provide(JwtServiceTag.Live),
  Effect.scoped,
  runMain
);
