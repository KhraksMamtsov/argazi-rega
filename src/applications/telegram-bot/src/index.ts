import { runMain } from "@effect/platform-node/NodeRuntime";
import { Effect, Config, Layer, Logger, LogLevel, Option, pipe } from "effect";
import { PrettyLogger } from "effect-log";

import * as http from "node:http";

// import { CacheServiceTag } from "./infrastructure/cache/Cache.service.js";
import { NotificationServiceLive } from "@argazi/message-broker";
// import { AuthenticationHandler } from "./infrastructure/telegram-bot/Authentication.handler.js";
// import { CallbackQueryHandler } from "./infrastructure/telegram-bot/callback-query/CallbackQuery.handler.js";
// import { CommandsHandlerLive } from "./infrastructure/telegram-bot/command/CommandsHandler.js";
// // import { NotificationsHandlerLive } from "./infrastructure/telegram-bot/notifications/NotificationsHandlerLive.js";
// import { NotificationsHandlerLive } from "./infrastructure/telegram-bot/notifications/NotificationsHandlerLive.js";
// import { RestApiServiceTag } from "./infrastructure/telegram-bot/RestApiService.js";
// import { SessionServiceTag } from "./infrastructure/telegram-bot/Session.service.js";
import * as TgBot from "./telegraf/bot/TelegrafBot";
import { ArgazipaSayMdComponent } from "./ui/ArgazipaSay.md-component";
import { MD } from "./ui/Markdown";
import { SessionServiceTag } from "./Session.service";
import { CallbackQueryHandler } from "./callback-query/CallbackQuery.handler";
import { TelegrafTag } from "./telegraf/Telegraf";
import { AuthenticationHandler } from "./Authentication.handler";
import { CommandsHandlerLive } from "./command/CommandsHandler";
import { NotificationsHandlerLive } from "./notifications/NotificationsHandlerLive";
import { TelegrafOptionsTag } from "./telegraf/TelegrafOptions";
import { RestApiServiceTag } from "./RestApiService";
import { CacheServiceTag } from "@argazi/cache";
// import { TelegrafTag } from "./infrastructure/telegram-bot/telegraf/Telegraf.js";
// import { TelegrafOptionsTag } from "./infrastructure/telegram-bot/telegraf/TelegrafOptions.js";
// import { ArgazipaSayMdComponent } from "./infrastructure/telegram-bot/ui/ArgazipaSay.md-component.js";
// import { MD } from "./infrastructure/telegram-bot/ui/Markdown.js";

export const debugLogger = pipe(
	PrettyLogger.layer({
		enableColors: true,
		showFiberId: true,
		showSpans: true,
		showTime: true,
	}),
	Layer.merge(Logger.minimumLogLevel(LogLevel.All))
);

const CallbackQueryHandlerLive = Layer.scopedDiscard(
	TgBot.callBackQuery((context) =>
		Effect.gen(function* (_) {
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
				return yield* _(context.replyWithMarkdown(text, {}));
			}

			return yield* _(
				CallbackQueryHandler({
					accessToken: credentialsOption.value.accessToken,
					callbackQueryPayload: context,
				})
			);
		})
	)
).pipe(Layer.provide(TelegrafTag.Live));

const WebAppHandlerLive = Layer.scopedDiscard(
	TgBot.webAppData((context) =>
		Effect.gen(function* (_) {
			return yield* _(AuthenticationHandler(context));
		})
	)
).pipe(Layer.provide(TelegrafTag.Live));

const TelegrafHandlerLive = TelegrafTag.Launch.pipe(
	Layer.provide(CommandsHandlerLive),
	Layer.provide(CallbackQueryHandlerLive),
	Layer.provide(WebAppHandlerLive),
	Layer.provide(NotificationsHandlerLive),
	Layer.provide(
		TelegrafOptionsTag.layerConfig({
			token: Config.secret("TELEGRAM_BOT_TOKEN"),
		})
	)
);

export const runnable = pipe(
	TelegrafHandlerLive,
	Layer.provide(debugLogger),
	Layer.provide(NotificationServiceLive),
	Layer.provide(RestApiServiceTag.Live()),
	Layer.provide(SessionServiceTag.Live()),
	Layer.provide(CacheServiceTag.Live({})),
	Layer.launch,
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

// void Effect.runPromiseExit(runnable).then(
// 	Exit.match({
// 		onFailure: (x) => {
// 			console.log("runPromiseExit exit onFailure", x._tag);
// 			console.dir(x, { depth: 1000 });
// 		},
// 		onSuccess: () => {
// 			console.log("runPromiseExit exit onSuccess");
// 		},
// 	})
// );
runMain(runnable);
