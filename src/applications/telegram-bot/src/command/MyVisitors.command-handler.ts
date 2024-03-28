import { Effect, pipe, ReadonlyArray } from "effect";

import { MyVisitors } from "./TelegramCommands.js";

import { RestApiServiceTag } from "../RestApiService.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";
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
      ReadonlyArray.match({
        onEmpty: () =>
          ReadonlyArray.of(
            ArgazipaSayMdComponent({
              emotion: "😳",
              phrase: "У вас нет посетителей",
            }).pipe(
              Effect.flatMap((x) => args.command.replyWithMarkdown(x, {}))
            )
          ),
        onNonEmpty: ReadonlyArray.map((visitor) =>
          VisitorMdComponent({ visitor }).pipe(
            Effect.flatMap((x) => args.command.replyWithMarkdown(x, {}))
          )
        ),
      })
    );

    return yield* _(
      Effect.all(replies, { concurrency: "unbounded", mode: "either" }),
      Effect.tap(Effect.log)
    );
  });
