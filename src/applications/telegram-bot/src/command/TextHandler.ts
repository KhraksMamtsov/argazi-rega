import { Effect, Layer } from "effect";

import * as TgB from "../telegraf/bot/TelegrafBot.js";
import { TelegrafTag } from "../telegraf/Telegraf.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";

export const TextHandlerLive = Layer.scopedDiscard(
  TgB.text((context) =>
    Effect.gen(function* () {
      return yield* context.replyWithMarkdown(
        yield* ArgazipaSayMdComponent({
          emotion: "🧐",
          phrase: [
            "Когда-то и меня вела дорога приключений ...",
            "А потом мне прострелили колено",
          ],
        }),
        {}
      );
    })
  )
).pipe(Layer.provide(TelegrafTag.Live));
