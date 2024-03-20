import {
	Cache,
	Config,
	Data,
	Duration,
	Effect,
	Either,
	Layer,
	Schedule,
	Secret,
	SynchronizedRef,
} from "effect";
import { Client, ClientError } from "effect-http";

import { SessionServiceTag, type UserCredentials } from "./Session.service.js";

import { RestApi } from "../rest-api/RestApi.js";

import type { IdTelegramChat } from "../../libraries/domain/src/user/entity/IdTelegramChat.js";

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
	Effect.gen(function* (_) {
		const apiUrl = yield* _(Config.secret("API_URL"));
		const apiPort = yield* _(Config.secret("API_PORT"));

		const restApiClient = Client.make(RestApi, {
			baseUrl: new URL(`${Secret.value(apiUrl)}:${Secret.value(apiPort)}`)
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
					security: { bearer: Secret.Secret }
				) => Effect.Effect<A, E, R>
			) =>
			(input: I) =>
				Effect.gen(function* (_) {
					const actualUserCredentials = yield* _(
						SynchronizedRef.get(args.userCredentialsSyncRef)
					);

					const requestResult = yield* _(
						apiMethod(input, {
							bearer: actualUserCredentials.accessToken,
						}),
						Effect.either
					);

					if (Either.isRight(requestResult)) {
						return requestResult.right;
					}

					console.log("TOKEN REFRESHING");

					// TODO: check accessToken expired
					const refreshedCredentials = yield* _(
						SynchronizedRef.updateAndGetEffect(
							args.userCredentialsSyncRef,
							({ refreshToken }) =>
								Effect.gen(function* (_) {
									const refreshAuthResult = yield* _(
										restApiClient.refreshToken({
											body: { refreshToken },
										}),
										// Effect.timeout(Duration.seconds(5)),
										Effect.retry({
											schedule: Schedule.exponential(Duration.millis(100), 2),
											times: 5,
											while: (error) =>
												error.side === "server" && error.status === 401,
										}),
										Effect.either
									);

									if (Either.isLeft(refreshAuthResult)) {
										yield* _(SessionServiceTag.drop(args.idTelegramChat));
										return yield* _(
											new RefreshTokenExpired({
												clientError: refreshAuthResult.left,
											})
										);
									}

									yield* _(
										SessionServiceTag.create(
											args.idTelegramChat,
											refreshAuthResult.right
										)
									);

									return refreshAuthResult.right;
								})
						)
					);

					return yield* _(
						apiMethod(input, {
							bearer: refreshedCredentials.accessToken,
						})
					);
				});

		const createUserApiClient = (args: {
			readonly idTelegramChat: IdTelegramChat;
		}) =>
			Effect.gen(function* (_) {
				const sessionService = yield* _(SessionServiceTag);
				const credentials = yield* _(
					sessionService.get(args.idTelegramChat),
					Effect.flatten
				);

				const userCredentialsSyncRef = yield* _(
					SynchronizedRef.make(credentials)
				);

				const wrapMethod = autoRefreshSynchronized({
					idTelegramChat: args.idTelegramChat,
					userCredentialsSyncRef,
				});

				return {
					getEvent: wrapMethod(restApiClient.getEvent),
					getMyIdentity: wrapMethod(restApiClient.getMyIdentity),
					getMySubscriptions: wrapMethod(restApiClient.getMySubscriptions),
					getMyTickets: wrapMethod(restApiClient.getMyTickets),
					getPlaceActualEvents: wrapMethod(restApiClient.getPlaceActualEvents),
					getPlaces: wrapMethod(restApiClient.getPlaces),
					loginDwbn: restApiClient.loginDwbn,
				};
			});

		const cache = yield* _(
			Cache.make({
				capacity: Infinity,
				lookup: (idTelegramChat: IdTelegramChat) =>
					createUserApiClient({ idTelegramChat }),
				timeToLive: "60 minutes",
			})
		);

		return {
			...restApiClient,
			__new: {
				getUserApiClientFor: (idTelegramChat: IdTelegramChat) =>
					cache.get(idTelegramChat),
			},
		};
	});
