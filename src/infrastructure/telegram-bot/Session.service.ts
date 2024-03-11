import { Effect, flow, Layer, Option, Secret, Struct } from "effect";

import { CacheServiceTag } from "../cache/Cache.service.js";
import * as AT from "../rest-api/authentication/AccessToken.js";
import * as RT from "../rest-api/authentication/RefreshToken.js";

import type { IdTelegramChat } from "../../domain/user/entity/IdTelegramChat.js";

export interface UserCredentials {
	readonly accessToken: AT.AccessToken;
	readonly refreshToken: RT.RefreshToken;
}

const ACCESS_TOKEN_FIELD = "accessToken" satisfies keyof UserCredentials;
const REFRESH_TOKEN_FIELD = "refreshToken" satisfies keyof UserCredentials;

export const makeLive = () =>
	Effect.gen(function* (_) {
		const cacheService = yield* _(CacheServiceTag);

		return {
			create: (idTelegramChat: IdTelegramChat, credentials: UserCredentials) =>
				cacheService
					.hSet(idTelegramChat.toString(), {
						accessToken: Secret.value(credentials.accessToken),
						refreshToken: Secret.value(credentials.refreshToken),
					})
					.pipe(
						Effect.tapBoth({
							onFailure: Effect.logError,
							onSuccess: Effect.logInfo,
						}),
						Effect.andThen(Effect.unit),
						Effect.catchAll((_) => Effect.unit)
					)
					.pipe(
						Effect.withLogSpan("SessionService.set"),
						Effect.annotateLogs({ credentials, idTelegramChat })
					),
			drop: (idTelegramChat: IdTelegramChat) => {
				return cacheService
					.hDel(idTelegramChat.toString(), [
						ACCESS_TOKEN_FIELD,
						REFRESH_TOKEN_FIELD,
					])
					.pipe(
						Effect.tapBoth({
							onFailure: Effect.logError,
							onSuccess: Effect.logInfo,
						}),
						Effect.andThen(Effect.unit),
						Effect.catchAll((_) => Effect.unit)
					)
					.pipe(
						Effect.withLogSpan("SessionService.logout"),
						Effect.annotateLogs({ idTelegramChat })
					);
			},
			get: (idTelegramChat: IdTelegramChat) =>
				Effect.all(
					{
						accessToken: cacheService.hGet(
							idTelegramChat.toString(),
							ACCESS_TOKEN_FIELD
						),
						refreshToken: cacheService.hGet(
							idTelegramChat.toString(),
							REFRESH_TOKEN_FIELD
						),
					},
					{ concurrency: "unbounded" }
				)
					.pipe(
						Effect.map(
							flow(
								Option.all,
								Option.map(
									Struct.evolve({
										accessToken: AT.AccessTokenSchema,
										refreshToken: RT.RefreshTokenSchema,
									})
								)
							)
						),
						Effect.tapBoth({
							onFailure: Effect.logError,
							onSuccess: Effect.logInfo,
						}),
						Effect.catchAll((_) => Effect.succeed(Option.none()))
					)
					.pipe(
						Effect.withLogSpan("SessionService.accessToken"),
						Effect.annotateLogs({ idTelegramChat })
					),
		} as const;
	});

export interface SessionService
	extends Effect.Effect.Success<ReturnType<typeof makeLive>> {}

export class SessionServiceTag extends Effect.Tag(
	"@argazi/infrastructure/telegram-bot/SessionService"
)<SessionServiceTag, SessionService>() {
	public static readonly Live = () => Layer.effect(this, makeLive());
}
