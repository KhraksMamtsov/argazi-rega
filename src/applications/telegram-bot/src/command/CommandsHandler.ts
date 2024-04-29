import { Effect, Layer, Option } from "effect";
import * as Markup from "telegraf/markup";

import { EventsCommandHandler } from "./Events.command-handler.js";
import { LogoutCommandHandler } from "./Logout.command-handler.js";
import { MeCommandHandler } from "./Me.command-handler.js";
import { MyVisitorsCommandHandler } from "./MyVisitors.command-handler.js";
import { PlacesCommandHandler } from "./Places.command-handler.js";
import * as TgCommand from "./TelegramCommands.js";

import { SessionServiceTag } from "../Session.service.js";
import * as TgB from "../telegraf/bot/TelegrafBot.js";
import { CommandPayload } from "../telegraf/bot/TelegramPayload.js";
import { TelegrafTag } from "../telegraf/Telegraf.js";
import { TelegramAuthMiniAppURL } from "../TelegramAuthMiniApp.service.js";
import {
  accentify,
  ArgazipaSayMdComponent,
} from "../ui/ArgazipaSay.md-component.js";
import { MD } from "../ui/Markdown.js";

export const CommandsHandlerLive = Layer.scopedDiscard(
  TgB.command({
    handler: (context) =>
      Effect.gen(function* (_) {
        if (
          CommandPayload.isOfCommand(TgCommand.Login.command)(context) ||
          CommandPayload.isOfCommand(TgCommand.Start.command)(context)
        ) {
          const text = yield* ArgazipaSayMdComponent({
            emotion: "🔐",
            phrase: [
              "Необходимо войти через DWBN",
              "Кнопка входа появится под строкой ввода текста",
            ],
          });

          return yield* TelegramAuthMiniAppURL.pipe(
            Effect.tap(Effect.logInfo),
            Effect.flatMap((telegramAuthMiniAppURL) =>
              context.replyWithMarkdown(
                text,
                Markup.keyboard([
                  Markup.button.webApp(
                    accentify("🔐 Войти через DWBN ☸️"),
                    telegramAuthMiniAppURL.toString()
                  ),
                ])
              )
            )
          );
        }

        const sessionService = yield* SessionServiceTag;
        const credentialsOption = yield* sessionService.get(
          context.idTelegramChat
        );

        const text = yield* MD.document(
          ArgazipaSayMdComponent({
            emotion: "🤨",
            phrase: "Не узнаю тебя, путник",
          }),
          "/login"
        );

        if (Option.isNone(credentialsOption)) {
          return yield* context.replyWithMarkdown(text, {});
        }

        if (CommandPayload.isOfCommand(TgCommand.Places.command)(context)) {
          return yield* PlacesCommandHandler({ command: context });
        }

        if (CommandPayload.isOfCommand(TgCommand.MyEvents.command)(context)) {
          return yield* EventsCommandHandler({ command: context });
        }

        if (CommandPayload.isOfCommand(TgCommand.Me.command)(context)) {
          return yield* MeCommandHandler({ command: context });
        }

        if (CommandPayload.isOfCommand(TgCommand.Logout.command)(context)) {
          return yield* LogoutCommandHandler({ command: context });
        }

        if (CommandPayload.isOfCommand(TgCommand.MyVisitors.command)(context)) {
          return yield* MyVisitorsCommandHandler({ command: context });
        }

        return yield* context.replyWithMarkdown(
          yield* ArgazipaSayMdComponent({
            emotion: "🤨",
            phrase: ["Что-то на эльфийском...", "Не могу разобрать..."],
          }),
          {}
        );
      }),
  })
).pipe(Layer.provide(TelegrafTag.Live));
