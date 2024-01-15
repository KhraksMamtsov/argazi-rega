import { Schema } from "@effect/schema";
import { Effect, Either } from "effect";
import { constVoid } from "effect/Function";

import { RestApiServiceTag } from "./RestApiService.js";
import { SessionServiceTag } from "./Session.service.js";
import { TelegramAuthMiniAppDataSchema } from "./TelegramAuthMiniAppData.js";

import { IdTelegramChatSchema } from "../../domain/user/entity/IdTelegramChat.js";

import type { TelegrafBot, WebAppDataPayload } from "./telegraf/TelegrafBot.js";

export const decode = Schema.decode(TelegramAuthMiniAppDataSchema);

export const AuthenticationHandler = (
	webAppDataPayload: WebAppDataPayload,
	bot: TelegrafBot
) =>
	Effect.gen(function* (_) {
		const restApiClient = yield* _(RestApiServiceTag);
		const sessionService = yield* _(SessionServiceTag);

		const authenticationData = yield* _(
			decode(webAppDataPayload.message.web_app_data.data).pipe(
				Effect.tapError(Effect.logError)
			)
		);

		const idTelegramChat = IdTelegramChatSchema(
			webAppDataPayload.message.chat.id
		);

		const authenticationResult = yield* _(
			restApiClient.loginDwbn({
				body: {
					code: authenticationData.data.code,
					idTelegramChat,
				},
			}),
			Effect.either
		);
		if (Either.isLeft(authenticationResult)) {
			console.log(authenticationResult);
			constVoid();
			return;
		}

		yield* _(
			sessionService.create(idTelegramChat, {
				accessToken: authenticationResult.right.credentials.accessToken,
				refreshToken: authenticationResult.right.credentials.refreshToken,
			})
		);

		return yield* _(
			bot.sendMessage(webAppDataPayload.message.chat.id, "Вы залогинились")
		);
	});
