import { Config, Context, Effect, Layer, Secret } from "effect";
import { Client } from "effect-http";

import { RestApi } from "../rest-api/RestApi.js";

export type RestApiClient = Effect.Effect.Success<ReturnType<typeof makeLive>>;

export class RestApiClientTag extends Context.Tag(
	"@argazi/infrastructure/telegram-bot/RestApiClientService"
)<RestApiClientTag, RestApiClient>() {
	public static readonly Live = () => Layer.effect(this, makeLive());
}

export const makeLive = () =>
	Effect.gen(function* (_) {
		const apiUrl = yield* _(Config.secret("API_URL"));
		const apiPort = yield* _(Config.secret("API_PORT"));
		// const basicAuthSecret = yield* _(Config.secret("BASIC_AUTH_BOT_SECRET"));

		// const { content } = yield* _(
		//   restApiClient.loginBasic({
		//     body: { basicSecret: Secret.value(basicAuthSecret) },
		//   }),
		// );
		//
		// const botCredentials = yield* _(SynchronizedRef.make(content));
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
		//   Effect.gen(function* (_) {
		//     const actualCred = yield* _(SynchronizedRef.get(botCredentials));
		//
		//     actualCred!;
		//     const asd = yield* _(request, Effect.either);
		//
		//     if (Either.isRight(asd)) {
		//       return asd;
		//     } else {
		//       yield* _(
		//         SynchronizedRef.updateEffect(botCredentials, (prevCredentials) =>
		//           refreshCredentials(prevCredentials.refreshToken),
		//         ),
		//       );
		//
		//       const actualCred = yield* _(SynchronizedRef.get(botCredentials));
		//
		//       actualCred!;
		//       const asd = yield* _(request, Effect.either);
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

		const userApiClient = Client.make(RestApi, {
			baseUrl: new URL(`${Secret.value(apiUrl)}:${Secret.value(apiPort)}`)
				.origin,
		});

		return userApiClient;
	});
