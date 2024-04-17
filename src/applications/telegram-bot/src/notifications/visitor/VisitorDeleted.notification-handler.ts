import { Effect, Array } from "effect";

import type { User, Visitor } from "@argazi/domain";

import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { VisitorMdComponent } from "../../ui/Visitor.md-component.js";

export const VisitorDeletedNotificationHandler = (args: {
  readonly deletedVisitor: Visitor;
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
          markup: MD.document(
            ArgazipaSayMdComponent({
              emotion: "ℹ️",
              phrase: "Посетитель удален",
            }),
            MD.br,
            VisitorMdComponent({ visitor: args.deletedVisitor })
          ),
        }).pipe(Effect.flatMap(({ markup }) => bot.sendMessage(x, markup)))
      ),
      Effect.allWith({
        concurrency: "unbounded",
      })
    );
  });
