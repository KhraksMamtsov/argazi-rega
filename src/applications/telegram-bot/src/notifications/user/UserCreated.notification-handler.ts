import { Effect, Array, pipe } from "effect";

import type { User } from "@argazi/domain";

import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { UserMdComponent } from "../../ui/User.md-component.js";

export const UserCreatedNotificationHandler = (args: {
  readonly createdUser: User;
  readonly initiator: User;
}) =>
  Effect.gen(function* (_) {
    const bot = yield* TelegrafTag;

    return yield* pipe(
      [args.initiator, args.createdUser],
      Array.map((x) => x.idTelegramChat),
      (x) => [...new Set(x)],
      Array.map((x) =>
        MD.document(
          ArgazipaSayMdComponent({
            emotion: "ℹ️",
            phrase: "Создан пользователь",
          }),
          MD.br,
          UserMdComponent({ user: args.createdUser })
        ).pipe(Effect.flatMap((text) => bot.sendMessage(x, text)))
      ),
      Effect.allWith({
        concurrency: "unbounded",
      })
    );
  });
