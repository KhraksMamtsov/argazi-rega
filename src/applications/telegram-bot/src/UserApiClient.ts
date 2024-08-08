import { Config, Effect, Layer, Redacted, Context } from "effect";
import { Client } from "effect-http";

import { RestApiSpec } from "@argazi/rest-api";

export interface _RestApiClient
  extends Effect.Effect.Success<ReturnType<typeof makeLive>> {}

export class RestApiClientTag extends Context.Tag(
  "@argazi/infrastructure/telegram-bot/RestApiClientService"
)<RestApiClientTag, _RestApiClient>() {
  public static readonly Live = () => Layer.effect(this, makeLive());
}

export const makeLive = () =>
  Effect.gen(function* () {
    const apiUrl = yield* Config.redacted("API_URL");
    const apiPort = yield* Config.redacted("API_PORT");
    // const basicAuthSecret = yield* pipe(Config.redacted("BASIC_AUTH_BOT_SECRET"));

    // const { content } = yield* pipe(
    //   restApiClient.loginBasic({
    //     body: { basicSecret: Redacted.value(basicAuthSecret) },
    //   }),
    // );
    //
    // const botCredentials = yield* pipe(SynchronizedRef.make(content));
    //
    // const refreshCredentials = (refreshToken: RefreshToken) =>
    //   restApiClient
    //     .refreshAuthentication({
    //       body: { refreshToken },
    //     })
    //     .pipe(
    //       Effect.retry(Schedule.exponential("10 millis")),
    //       Effect.map((x) => x.content),
    //     );
    //
    // const wrapRequest = <R, E, A>(request: Effect.Effect<R, E, A>) =>
    //   Effect.gen(function* () {
    //     const actualCred = yield* pipe(SynchronizedRef.get(botCredentials));
    //
    //     actualCred!;
    //     const asd = yield* pipe(request, Effect.either);
    //
    //     if (Either.isRight(asd)) {
    //       return asd;
    //     } else {
    //       yield* pipe(
    //         SynchronizedRef.updateEffect(botCredentials, (prevCredentials) =>
    //           refreshCredentials(prevCredentials.refreshToken),
    //         ),
    //       );
    //
    //       const actualCred = yield* pipe(SynchronizedRef.get(botCredentials));
    //
    //       actualCred!;
    //       const asd = yield* pipe(request, Effect.either);
    //       return asd;
    //     }
    //   });
    //
    // console.log(botCredentials);
    // // wrap client:
    // // substitute credentials
    // // refresh credentials in case of out...

    // const client = {
    //   returnTicket: (
    //     cb: <R, I, A>(args: {
    //       client: typeof restApiClient;
    //       idUser: IdUser;
    //     }) => Effect.Effect<R, I, A>,
    //   ) => cb({client: restApiClient, idUser}),
    // };

    const userApiClient = Client.make(RestApiSpec, {
      baseUrl: new URL(`${Redacted.value(apiUrl)}:${Redacted.value(apiPort)}`)
        .origin,
    });

    return userApiClient;
  });
