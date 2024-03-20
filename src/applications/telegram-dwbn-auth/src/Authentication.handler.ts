import { Schema } from "@effect/schema";
import { Effect, Either } from "effect";
import { constVoid } from "effect/Function";

import { RestApiServiceTag } from "./RestApiService.js";
import { SessionServiceTag } from "./Session.service.js";
import { TelegramAuthMiniAppDataSchema } from "./TelegramAuthMiniAppData.js";
import { ArgazipaSayMdComponent } from "./ui/ArgazipaSay.md-component.js";
import { MD } from "./ui/Markdown.js";
import { UserMdComponent } from "./ui/User.md-component.js";

import { IdTelegramChatSchema } from "../../libraries/domain/src/user/entity/IdTelegramChat.js";

import type { WebAppDataPayload } from "./telegraf/bot/TelegramPayload.js";

export const decode = Schema.decode(TelegramAuthMiniAppDataSchema);

export const AuthenticationHandler = (webAppDataPayload: WebAppDataPayload) =>
	Effect.gen(function* (_) {
		const restApiService = yield* _(RestApiServiceTag);
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
			restApiService.loginDwbn({
				body: {
					code: authenticationData.data.code,
					idTelegramChat,
				},
			}),
			Effect.either
		);
		if (Either.isLeft(authenticationResult)) {
			console.log(authenticationResult);
			constVoid(); // TODO: error
			return;
		}

		yield* _(
			sessionService.create(idTelegramChat, {
				accessToken: authenticationResult.right.credentials.accessToken,
				refreshToken: authenticationResult.right.credentials.refreshToken,
			})
		);

		const restApiUserClient = yield* _(
			restApiService.__new.getUserApiClientFor(idTelegramChat)
		);

		const myIdentity = yield* _(restApiUserClient.getMyIdentity({}));

		const answerText = yield* _(
			MD.document(
				ArgazipaSayMdComponent({ emotion: "🙏", phrase: "Добро пожаловать" }),
				MD.br,
				UserMdComponent({ user: myIdentity })
			)
		);

		return yield* _(
			webAppDataPayload.replyWithMarkdown(answerText, {
				reply_markup: { remove_keyboard: true },
			})
		);
	});
