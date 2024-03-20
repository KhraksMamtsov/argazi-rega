import { NotificationServiceLive } from "@argazi/message-broker";
import { HttpClient } from "@effect/platform";
import { runMain } from "@effect/platform-node/NodeRuntime";
import { Effect, flow, Layer, Logger, LogLevel, Option, pipe } from "effect";
import { RouterBuilder, ServerError } from "effect-http";
import { isServerError } from "effect-http/ServerError";
import { NodeServer } from "effect-http-node";
import { PrettyLogger } from "effect-log";

import { CreateEventUseCase } from "./application/use-cases/event/create/CreateEvent.use-case.js";
import { GetEventByIdUseCase } from "./application/use-cases/event/get/GetEventById.use-case.js";
import { CreateGeoPointUseCase } from "./application/use-cases/geo-point/create/CreateGeoPoint.use-case.js";
import { GetPlaceGeoPointUseCase } from "./application/use-cases/place/_geo-point/get-place-geo-point/GetPlaceGeoPoint.use-case.js";
import { GetPlaceActualEventsUseCase } from "./application/use-cases/place/_subscription/get-place-actual-events/GetPlaceActualEvents.use-case.js";
import { GetPlaceSubscriptionsUseCase } from "./application/use-cases/place/_subscription/get-place-subscriptions/GetPlaceSubscriptions.use-case.js";
import { CreatePlaceUseCase } from "./application/use-cases/place/create/CreatePlace.use-case.js";
import { GetPlaceByIdUseCase } from "./application/use-cases/place/get/GetPlaceById.use-case.js";
import { GetPlacesUseCase } from "./application/use-cases/place/get/GetPlaces.use-case.js";
import { CreateSubscriptionUseCase } from "./application/use-cases/subscription/create/CreateSubscription.use-case.js";
import { GetSubscriptionByIdUseCase } from "./application/use-cases/subscription/get/GetSubscriptionById.use-case.js";
import { CreateTransportUseCase } from "./application/use-cases/transport/create/CreateTransport.use-case.js";
import { DeleteUserSubscriptionUseCase } from "./application/use-cases/user/_subscription/delete/DeleteUserSubscription.use-case.js";
import { GetUserSubscriptionsUseCase } from "./application/use-cases/user/_subscription/get-many/GetUserSubscriptions.use-case.js";
import { BookTicketUseCase } from "./application/use-cases/user/_ticket/book-ticket/BookTicket.use-case.js";
import { GetUserTicketByIdUseCase } from "./application/use-cases/user/_ticket/get-by-id/GetUserTicketById.use-case.js";
import { GetUserTicketsUseCase } from "./application/use-cases/user/_ticket/get-tickets/GetUserTickets.use-case.js";
import { ReturnTicketUseCase } from "./application/use-cases/user/_ticket/return-ticket/ReturnTicket.use-case.js";
import { CreateUserUseCase } from "./application/use-cases/user/create/CreateUser.use-case.js";
import { GetUserUseCase } from "./application/use-cases/user/get/GetUser.use-case.js";
import { GetManyUsersUseCase } from "./application/use-cases/user/get-many/GetManyUsers.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/user/update/UpdateUser.use-case.js";
import { PrismaServiceTag } from "./infrastructure/database/Prisma.service.js";
import { IdAdmin } from "./infrastructure/rest-api/authentication/constants.js";
import { JwtServiceTag } from "./infrastructure/rest-api/authentication/Jwt.service.js";
import { LoginBasicHandler } from "./infrastructure/rest-api/authentication/login-basic/LoginBasic.handler.js";
import { LoginDwbnHandler } from "./infrastructure/rest-api/authentication/login-dwbn/LoginDwbn.handler.js";
import { RefreshTokenHandler } from "./infrastructure/rest-api/authentication/refresh-token/RefreshToken.handler.js";
import { BearerAuthGuard } from "./infrastructure/rest-api/BearerAuth.guard.js";
import { RestApi } from "./infrastructure/rest-api/RestApi.js";

export const debugLogger = pipe(
	PrettyLogger.layer(),
	Layer.merge(Logger.minimumLogLevel(LogLevel.All))
);

const app = pipe(
	RouterBuilder.make(RestApi, { parseOptions: { errors: "all" } }),
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
		RouterBuilder.handle("loginBasic", (_, { basic: { token } }) =>
			Effect.gen(function* (_) {
				const loginResult = yield* _(LoginBasicHandler({ token }));

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

				return { body: result, status: 200 as const };
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

				return {
					body: placeSubscriptions,
					status: 200 as const,
				};
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
						onSome: (subscription) =>
							Effect.succeed({
								body: subscription,
								status: 200 as const,
							}),
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
					// ^?
					CreateGeoPointUseCase({
						idInitiator,
						payload: body,
					})
				);

				return {
					body: qwe,
					status: 200 as const,
				};
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
				}).pipe(
					Effect.map((content) => ({
						content,
						status: 200 as const,
					}))
				)
			)
		)
	),
	// endregion
	// region Healthcheck handlers
	RouterBuilder.handle("healthcheckPing", (x) =>
		Effect.succeed(x.query.echo ?? "pong").pipe(Effect.tap(Effect.logInfo))
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
