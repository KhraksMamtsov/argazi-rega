import { runMain } from "@effect/platform-node/NodeRuntime";
import { Effect, Config, Layer, Logger, LogLevel, Option, pipe } from "effect";
import { PrettyLogger } from "effect-log";

import * as http from "node:http";

import { CacheServiceTag } from "@argazi/cache";
import { NotificationServiceLive } from "@argazi/message-broker";

import { AuthenticationHandler } from "./Authentication.handler.js";
import { CallbackQueryHandler } from "./callback-query/CallbackQuery.handler.js";
import { CommandsHandlerLive } from "./command/CommandsHandler.js";
import { TextHandlerLive } from "./command/TextHandler.js";
import { NotificationsHandlerLive } from "./notifications/NotificationsHandlerLive.js";
import { RestApiServiceTag } from "./RestApiService.js";
import { SessionServiceTag } from "./Session.service.js";
import * as TgBot from "./telegraf/bot/TelegrafBot.js";
import { TelegrafTag } from "./telegraf/Telegraf.js";
import { TelegrafOptionsTag } from "./telegraf/TelegrafOptions.js";
import { ArgazipaSayMdComponent } from "./ui/ArgazipaSay.md-component.js";
import { MD } from "./ui/Markdown.js";

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
      const sessionService = yield* SessionServiceTag;
      const credentialsOption = yield* sessionService.get(
        context.idTelegramChat
      );

      if (Option.isNone(credentialsOption)) {
        const text = yield* MD.document(
          ArgazipaSayMdComponent({
            emotion: "🤨",
            phrase: "Не узнаю тебя, путник",
          }),
          "/login"
        );
        return yield* context.replyWithMarkdown(text, {});
      }

      return yield* CallbackQueryHandler({
        accessToken: credentialsOption.value.accessToken,
        callbackQueryPayload: context,
      });
    })
  )
).pipe(Layer.provide(TelegrafTag.Live));
const WebAppHandlerLive = Layer.scopedDiscard(
  TgBot.webAppData((context) =>
    Effect.gen(function* (_) {
      return yield* AuthenticationHandler(context);
    })
  )
).pipe(Layer.provide(TelegrafTag.Live));

const TelegrafHandlerLive = TelegrafTag.Launch.pipe(
  Layer.provide(CommandsHandlerLive),
  Layer.provide(TextHandlerLive),
  Layer.provide(CallbackQueryHandlerLive),
  Layer.provide(WebAppHandlerLive),
  Layer.provide(NotificationsHandlerLive),
  Layer.provide(
    TelegrafOptionsTag.layerConfig({
      token: Config.redacted("TELEGRAM_BOT_TOKEN"),
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

runMain(runnable);
