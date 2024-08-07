import {
  Cache,
  Config,
  Data,
  Duration,
  Effect,
  Either,
  Layer,
  Schedule,
  Redacted,
  SynchronizedRef,
  pipe,
} from "effect";
import { Client, ClientError } from "effect-http";

import type { IdTelegramChat } from "@argazi/domain";
import { RestApiSpec } from "@argazi/rest-api";

import { SessionServiceTag, type UserCredentials } from "./Session.service.js";

import { HttpClientRequest } from "@effect/platform";

export interface RestApiService
  extends Effect.Effect.Success<ReturnType<typeof makeLive>> {}

export class RestApiServiceTag extends Effect.Tag(
  "@argazi/infrastructure/telegram-bot/RestApiClientService"
)<RestApiServiceTag, RestApiService>() {
  public static readonly Live = () => Layer.effect(this, makeLive());
}

export class RefreshTokenExpired extends Data.TaggedError(
  "RefreshTokenExpired"
)<{
  clientError: ClientError.ClientError;
}> {}

export const makeLive = () =>
  Effect.gen(function* () {
    const apiUrl = yield* Config.redacted("API_URL");
    const apiPort = yield* Config.redacted("API_PORT");

    const restApiClient = Client.make(RestApiSpec, {
      baseUrl: new URL(`${Redacted.value(apiUrl)}:${Redacted.value(apiPort)}`)
        .origin,
    });

    const autoRefreshSynchronized =
      (args: {
        readonly idTelegramChat: IdTelegramChat;
        readonly userCredentialsSyncRef: SynchronizedRef.SynchronizedRef<UserCredentials>;
      }) =>
      <A, E, R, I>(
        apiMethod: (
          input: I,
          map: (
            request: HttpClientRequest.HttpClientRequest
          ) => HttpClientRequest.HttpClientRequest
        ) => Effect.Effect<A, E, R>
      ) =>
      (input: I) =>
        Effect.gen(function* (_) {
          const actualUserCredentials = yield* _(
            SynchronizedRef.get(args.userCredentialsSyncRef)
          );

          const requestResult = yield* _(
            apiMethod(
              input,
              Client.setBearer(
                Redacted.value(actualUserCredentials.accessToken)
              )
            ).pipe(Effect.either)
          );

          if (Either.isRight(requestResult)) {
            return requestResult.right;
          }

          // TODO: check accessToken expired
          const refreshedCredentials =
            yield* SynchronizedRef.updateAndGetEffect(
              args.userCredentialsSyncRef,
              ({ refreshToken }) =>
                Effect.gen(function* (_) {
                  const refreshAuthResult = yield* pipe(
                    restApiClient.refreshToken({
                      body: { refreshToken },
                    }),
                    // Effect.timeout(Duration.seconds(5)),
                    Effect.retry({
                      schedule: Schedule.exponential(Duration.millis(100), 2),
                      times: 5,
                      while: (error) => {
                        return error.side === "server" && error.status === 401;
                      },
                    }),
                    Effect.either
                  );

                  if (Either.isLeft(refreshAuthResult)) {
                    yield* SessionServiceTag.drop(args.idTelegramChat);
                    return yield* new RefreshTokenExpired({
                      clientError: refreshAuthResult.left,
                    });
                  }

                  yield* SessionServiceTag.create(
                    args.idTelegramChat,
                    refreshAuthResult.right
                  );

                  return refreshAuthResult.right;
                })
            );

          return yield* apiMethod(
            input,
            Client.setBearer(Redacted.value(refreshedCredentials.accessToken))
          );
        });

    const createUserApiClient = (args: {
      readonly idTelegramChat: IdTelegramChat;
    }) =>
      Effect.gen(function* (_) {
        const credentials = yield* _(
          SessionServiceTag.get(args.idTelegramChat),
          Effect.flatten
        );
        const userCredentialsSyncRef = yield* SynchronizedRef.make(credentials);

        const wrapMethod = autoRefreshSynchronized({
          idTelegramChat: args.idTelegramChat,
          userCredentialsSyncRef,
        });

        return {
          createMyVisitor: wrapMethod(restApiClient.createMyVisitor),
          getEvent: wrapMethod(restApiClient.getEvent),
          getMyIdentity: wrapMethod(restApiClient.getMyIdentity),
          getMySubscriptions: wrapMethod(restApiClient.getMySubscriptions),
          getMyTickets: wrapMethod(restApiClient.getMyTickets),
          getMyVisitors: wrapMethod(restApiClient.getMyVisitors),
          getPlaceActualEvents: wrapMethod(restApiClient.getPlaceActualEvents),
          getPlaces: wrapMethod(restApiClient.getPlaces),
          loginDwbn: restApiClient.loginDwbn,
        };
      });

    const cache = yield* Cache.make({
      capacity: Infinity,
      lookup: (idTelegramChat: IdTelegramChat) =>
        createUserApiClient({ idTelegramChat }),
      timeToLive: "60 minutes",
    });

    return {
      bookTicket: restApiClient.bookTicket,
      getUser: restApiClient.getUser,
      getVisitor: restApiClient.getVisitor,
      getPlaceById: restApiClient.getPlaceById,
      getSubscription: restApiClient.getSubscription,
      getUserTicketById: restApiClient.getUserTicketById,
      getEvent: restApiClient.getEvent,
      deleteMyVisitor: restApiClient.deleteMyVisitor,
      getManyUsers: restApiClient.getManyUsers,
      getPlaceSubscriptions: restApiClient.getPlaceSubscriptions,
      getPlaceGeoPoint: restApiClient.getPlaceGeoPoint,
      createMySubscription: restApiClient.createMySubscription,
      bookMyTicket: restApiClient.bookMyTicket,
      returnMyTicket: restApiClient.returnMyTicket,
      loginDwbn: restApiClient.loginDwbn,
      deleteMySubscription: restApiClient.deleteMySubscription,
      __new: {
        getUserApiClientFor: (idTelegramChat: IdTelegramChat) =>
          cache.get(idTelegramChat),
      },
    };
  });
