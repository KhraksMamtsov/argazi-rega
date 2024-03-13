import { HttpClient } from "@effect/platform";
import {
	absurd,
	Effect,
	Exit,
	flow,
	Layer,
	Logger,
	LogLevel,
	Option,
	pipe,
	Sink,
	Stream,
} from "effect";
import { PrettyLogger } from "effect-log";
import { Markup } from "telegraf";

import * as http from "node:http";

import {
	type NotificationService,
	NotificationServiceTag,
} from "./domain/services/NotificationService.js";
import { CacheServiceTag } from "./infrastructure/cache/Cache.service.js";
import { NotificationServiceLive } from "./infrastructure/message-broker/MessageBroker.js";
import { AuthenticationHandler } from "./infrastructure/telegram-bot/Authentication.handler.js";
import { CallbackQueryHandler } from "./infrastructure/telegram-bot/callback-query/CallbackQuery.handler.js";
import { EventsCommandHandler } from "./infrastructure/telegram-bot/command/Events.command-handler.js";
import { LogoutCommandHandler } from "./infrastructure/telegram-bot/command/Logout.command-handler.js";
import { MeCommandHandler } from "./infrastructure/telegram-bot/command/Me.command-handler.js";
import { PlacesCommandHandler } from "./infrastructure/telegram-bot/command/Places.command-handler.js";
import { handleNotification } from "./infrastructure/telegram-bot/notifications/HandleNotification.js";
import { RestApiServiceTag } from "./infrastructure/telegram-bot/RestApiService.js";
import { SessionServiceTag } from "./infrastructure/telegram-bot/Session.service.js";
import { TelegrafTag } from "./infrastructure/telegram-bot/telegraf/Telegraf.js";
import {
	CommandPayload,
	type TelegrafBot,
} from "./infrastructure/telegram-bot/telegraf/TelegrafBot.js";
import { TelegrafBotPayload } from "./infrastructure/telegram-bot/telegraf/TelegrafBot.js";
import { TelegrafOptionsTag } from "./infrastructure/telegram-bot/telegraf/TelegrafOptionsTag.js";
import { TelegramAuthMiniAppURL } from "./infrastructure/telegram-bot/TelegramAuthMiniApp.service.js";
import { ArgazipaSayMdComponent } from "./infrastructure/telegram-bot/ui/ArgazipaSay.md-component.js";
import { MD } from "./infrastructure/telegram-bot/ui/Markdown.js";

export const TelegrafLive = pipe(
	TelegrafTag.Live,
	Layer.provide(TelegrafOptionsTag.Live({}))
);
export const debugLogger = pipe(
	PrettyLogger.layer({
		enableColors: true,
		showFiberId: true,
		showSpans: true,
		showTime: true,
	}),
	Layer.merge(Logger.minimumLogLevel(LogLevel.All))
);

export const handle = (
	notificationService: NotificationService,
	bot: TelegrafBot
) => {
	return pipe(
		bot.command$("start", "login", "logout", "me", "places", "events"),
		Stream.merge(bot.webAppData$),
		Stream.merge(bot.callbackQuery$),
		Stream.merge(notificationService.stream$),
		Stream.run(
			Sink.forEach(
				flow((context) =>
					Effect.gen(function* (_) {
						if (context._tag === "NotificationMessage") {
							return yield* _(
								handleNotification({
									bot,
									notificationMessage: context,
								})
							);
						}

						if (context._tag === TelegrafBotPayload.WEB_APP_DATA) {
							return yield* _(AuthenticationHandler(context, bot));
						}

						if (context._tag === TelegrafBotPayload.COMMAND) {
							if (
								CommandPayload.isOfCommand("login")(context) ||
								CommandPayload.isOfCommand("start")(context)
							) {
								const text = yield* _(
									ArgazipaSayMdComponent({
										emotion: "🔐",
										phrase: "Необходимо зайти через DWBN",
									})
								);

								return yield* _(
									TelegramAuthMiniAppURL.pipe(
										Effect.tap(Effect.logInfo),
										Effect.flatMap((telegramAuthMiniAppURL) =>
											context.replyWithMarkdown(
												text,
												Markup.keyboard([
													Markup.button.webApp(
														"🔐 Зайти через DWBN ☸️",
														telegramAuthMiniAppURL.toString()
													),
												])
											)
										)
									)
								);
							}
						}

						const sessionService = yield* _(SessionServiceTag);
						const credentialsOption = yield* _(
							sessionService.get(context.idTelegramChat)
						);

						const text = yield* _(
							MD.document(
								ArgazipaSayMdComponent({
									emotion: "🤨",
									phrase: "Не узнаю тебя, путник",
								}),
								"/login"
							)
						);

						if (Option.isNone(credentialsOption)) {
							return yield* _(
								bot.sendMessage(context.idTelegramChat, text, {
									parse_mode: "MarkdownV2",
								})
							);
						}

						if (context._tag === TelegrafBotPayload.COMMAND) {
							if (CommandPayload.isOfCommand("places")(context)) {
								return yield* _(PlacesCommandHandler({ command: context }));
							}

							if (CommandPayload.isOfCommand("events")(context)) {
								return yield* _(EventsCommandHandler({ command: context }));
							}

							if (CommandPayload.isOfCommand("me")(context)) {
								return yield* _(MeCommandHandler({ command: context }));
							}

							if (CommandPayload.isOfCommand("logout")(context)) {
								return yield* _(LogoutCommandHandler({ command: context }));
							}
						}

						if (context._tag === TelegrafBotPayload.CALLBACK_QUERY) {
							return yield* _(
								CallbackQueryHandler({
									accessToken: credentialsOption.value.accessToken,
									bot,
									callbackQueryPayload: context,
								})
							);
						}

						return absurd<typeof Effect.unit>(context);
					})
				)
			)
		)
	);
};

export const program = Effect.gen(function* (_) {
	const telegrafService = yield* _(TelegrafTag);
	const notificationService = yield* _(NotificationServiceTag);
	const { bot, launch } = yield* _(telegrafService.init());

	yield* _(
		handle(notificationService, bot),
		Effect.provide(HttpClient.client.layer),
		Effect.catchAll(Effect.logError),
		Effect.tapDefect(Effect.logError),
		launch
	);
});

export const runnable = pipe(
	program,
	Effect.provide(debugLogger),
	Effect.provide(TelegrafLive),
	Effect.provide(NotificationServiceLive),
	Effect.provide(RestApiServiceTag.Live()),
	Effect.provide(SessionServiceTag.Live()),
	Effect.provide(CacheServiceTag.Live({})),
	Effect.scoped
);

const port = process.env["TELEGRAM_BOT_PORT"];

if (port) {
	http
		.createServer((_req, res) => {
			res.writeHead(200, { "Content-Type": "text/plain" });
			console.debug("pong");
			res.write("pong");
			res.end();
		})
		.listen(Number(port));
}

void Effect.runPromiseExit(runnable).then(
	Exit.match({
		onFailure: (x) => {
			console.log("runPromiseExit exit onFailure", x._tag);
			console.dir(x, { depth: 1000 });
		},
		onSuccess: () => {
			console.log("runPromiseExit exit onSuccess");
		},
	})
);
