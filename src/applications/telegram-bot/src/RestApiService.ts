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
  Schema,
} from "effect";
import { HttpApiClient, Url } from "@effect/platform";

import type { IdTelegramChat } from "@argazi/domain";
import { RestApiSpec } from "@argazi/rest-api-spec";

import { SessionServiceTag, type UserCredentials } from "./Session.service.js";

import type { Simplify } from "effect/Types";

export interface RestApiService
  extends Effect.Effect.Success<ReturnType<typeof makeLive>> {}

export class RestApiServiceTag extends Effect.Tag(
  "@argazi/infrastructure/telegram-bot/RestApiClientService"
)<RestApiServiceTag, RestApiService>() {
  public static readonly Live = () => Layer.effect(this, makeLive());
}

export class RefreshTokenExpired extends Data.TaggedError(
  "RefreshTokenExpired"
)<{ cause: unknown }> {}

export const makeLive = () =>
  Effect.gen(function* () {
    const apiUrl = yield* Config.url("API_URL");
    const apiPort = yield* Schema.Config(
      "API_PORT",
      Schema.NumberFromString.pipe(Schema.int(), Schema.between(0, 65535))
    );

    const restApiClient = yield* HttpApiClient.make(RestApiSpec, {
      // transformClient: () => {}
      baseUrl: Url.setPort(apiUrl, apiPort.toString()).toString(),
    });

    const autoRefreshSynchronized =
      (args: {
        readonly idTelegramChat: IdTelegramChat;
        readonly userCredentialsSyncRef: SynchronizedRef.SynchronizedRef<UserCredentials>;
      }) =>
      <
        A,
        E,
        R,
        I extends {
          readonly headers: {
            readonly Authorization: string;
          };
        },
      >(
        apiMethod: (input: I) => Effect.Effect<A, E, R>
      ) =>
      (
        input: I
        // Simplify<
        //   Omit<I, "headers"> & { headers: Omit<I["headers"], "Authorization"> }
        // >
      ) =>
        Effect.gen(function* () {
          const actualUserCredentials = yield* SynchronizedRef.get(
            args.userCredentialsSyncRef
          );

          const requestResult = yield* apiMethod({
            ...input,
            headers: {
              ...input.headers,
              Authorization: `Bearer ${Redacted.value(actualUserCredentials.accessToken)}`,
            },
          }).pipe(Effect.either);

          if (Either.isRight(requestResult)) {
            return requestResult.right;
          }

          // TODO: check accessToken expired
          const refreshedCredentials =
            yield* SynchronizedRef.updateAndGetEffect(
              args.userCredentialsSyncRef,
              ({ refreshToken }) =>
                Effect.gen(function* () {
                  const refreshAuthResult = yield* pipe(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    restApiClient.Authentication.refreshToken({
                      payload: { refreshToken },
                    }),
                    // Effect.timeout(Duration.seconds(5)),
                    Effect.retry({
                      schedule: Schedule.exponential(Duration.millis(100), 2),
                      times: 5,
                    }),
                    Effect.either
                  );

                  if (Either.isLeft(refreshAuthResult)) {
                    yield* SessionServiceTag.drop(args.idTelegramChat);
                    return yield* new RefreshTokenExpired({
                      cause: refreshAuthResult.left,
                    });
                  }

                  yield* SessionServiceTag.create(
                    args.idTelegramChat,
                    refreshAuthResult.right
                  );

                  return refreshAuthResult.right;
                })
            );

          return yield* apiMethod({
            ...input,
            headers: {
              ...input.headers,
              Authorization: `Bearer ${Redacted.value(refreshedCredentials.accessToken)}`,
            },
          });
        });

    const createUserApiClient = (args: {
      readonly idTelegramChat: IdTelegramChat;
    }) =>
      Effect.gen(function* () {
        const credentials = yield* SessionServiceTag.get(
          args.idTelegramChat
        ).pipe(Effect.flatten);
        const userCredentialsSyncRef = yield* SynchronizedRef.make(credentials);

        const wrapMethod = autoRefreshSynchronized({
          idTelegramChat: args.idTelegramChat,
          userCredentialsSyncRef,
        });

        return {
          createMyVisitor: wrapMethod(restApiClient.My.createMyVisitor),
          getEvent: wrapMethod(restApiClient.Event.getEvent),
          getMyIdentity: wrapMethod(restApiClient.My.getMyIdentity),
          getMySubscriptions: wrapMethod(restApiClient.My.getMySubscriptions),
          getMyTickets: wrapMethod(restApiClient.My.getMyTickets),
          getMyVisitors: wrapMethod(restApiClient.My.getMyVisitors),
          getPlaceActualEvents: wrapMethod(
            restApiClient.Place.getPlaceActualEvents
          ),
          getPlaces: wrapMethod(restApiClient.Place.getPlaces),
          loginDwbn: restApiClient.Authentication.loginDwbn,
        };
      });

    const cache = yield* Cache.make({
      capacity: Infinity,
      lookup: (idTelegramChat: IdTelegramChat) =>
        createUserApiClient({ idTelegramChat }),
      timeToLive: "60 minutes",
    });

    return {
      bookTicket: restApiClient.User.bookTicket,
      getUser: restApiClient.User.getUser,
      getVisitor: restApiClient.Visitor.getVisitor,
      getPlaceById: restApiClient.Place.getPlaceById,
      getSubscription: restApiClient.Subscriptions.getSubscription,
      getUserTicketById: restApiClient.User.getUserTicketById,
      getEvent: restApiClient.Event.getEvent,
      deleteMyVisitor: restApiClient.My.deleteMyVisitor,
      getManyUsers: restApiClient.User.getManyUsers,
      getPlaceSubscriptions: restApiClient.Place.getPlaceSubscriptions,
      getPlaceGeoPoint: restApiClient.Place.getPlaceGeoPoint,
      createMySubscription: restApiClient.My.createMySubscription,
      bookMyTicket: restApiClient.My.bookMyTicket,
      returnMyTicket: restApiClient.My.returnMyTicket,
      loginDwbn: restApiClient.Authentication.loginDwbn,
      deleteMySubscription: restApiClient.My.deleteMySubscription,
      __new: {
        getUserApiClientFor: (idTelegramChat: IdTelegramChat) =>
          cache.get(idTelegramChat),
      },
    };
  });
