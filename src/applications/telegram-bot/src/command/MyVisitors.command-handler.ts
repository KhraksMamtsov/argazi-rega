import { Effect, pipe, Array } from "effect";
import { Markup } from "telegraf";

import { MyVisitors } from "./TelegramCommands.js";

import { RestApiServiceTag } from "../RestApiService.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";
import { DeleteVisitorCbButton } from "../ui/button/DeleteVisitor.cb-button.js";
import { VisitorMdComponent } from "../ui/Visitor.md-component.js";

import type { CommandPayload } from "../telegraf/bot/TelegramPayload.js";

export const MyVisitorsCommandHandler = (args: {
  readonly command: CommandPayload<typeof MyVisitors.command>;
}) =>
  Effect.gen(function* (_) {
    const restApiService = yield* _(RestApiServiceTag);
    const restApiUserClient = yield* _(
      restApiService.__new.getUserApiClientFor(args.command.idTelegramChat)
    );

    const myVisitors = yield* _(restApiUserClient.getMyVisitors({}));

    const replies = pipe(
      myVisitors,
      Array.match({
        onEmpty: () =>
          Array.of(
            ArgazipaSayMdComponent({
              emotion: "😳",
              phrase: "У вас нет посетителей",
            }).pipe(
              Effect.flatMap((x) => args.command.replyWithMarkdown(x, {}))
            )
          ),
        onNonEmpty: Array.map((visitor) =>
          Effect.all({
            button: DeleteVisitorCbButton({ idVisitor: visitor.id }),
            markup: VisitorMdComponent({ visitor }),
          }).pipe(
            Effect.flatMap((x) =>
              args.command.replyWithMarkdown(
                x.markup,
                Markup.inlineKeyboard([x.button])
              )
            )
          )
        ),
      })
    );

    return yield* _(
      Effect.all(replies, { concurrency: "unbounded", mode: "either" }),
      Effect.tap(Effect.log)
    );
  });
