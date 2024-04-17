import { Effect, Array } from "effect";
import { Markup } from "telegraf";

import type { User, Visitor } from "@argazi/domain";

import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { DeleteVisitorCbButton } from "../../ui/button/DeleteVisitor.cb-button.js";
import { MD } from "../../ui/Markdown.js";
import { VisitorMdComponent } from "../../ui/Visitor.md-component.js";

export const VisitorCreatedNotificationHandler = (args: {
  readonly createdVisitor: Visitor;
  readonly initiator: User;
  readonly visitorsUser: User;
}) =>
  Effect.gen(function* (_) {
    const bot = yield* _(TelegrafTag);

    return yield* _(
      [args.initiator, args.visitorsUser],
      Array.map((x) => x.idTelegramChat),
      (x) => [...new Set(x)],
      Array.map((x) =>
        Effect.all({
          button: DeleteVisitorCbButton({ idVisitor: args.createdVisitor.id }),
          markup: MD.document(
            ArgazipaSayMdComponent({
              emotion: "ℹ️",
              phrase: "Создан посетитель",
            }),
            MD.br,
            VisitorMdComponent({ visitor: args.createdVisitor })
          ),
        }).pipe(
          Effect.flatMap(({ markup, button }) =>
            bot.sendMessage(x, markup, Markup.inlineKeyboard([button]))
          )
        )
      ),
      Effect.allWith({
        concurrency: "unbounded",
      })
    );
  });
