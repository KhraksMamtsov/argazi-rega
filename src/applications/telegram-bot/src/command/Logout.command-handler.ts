import { Effect, pipe } from "effect";

import { Logout } from "./TelegramCommands.js";

import { SessionServiceTag } from "../Session.service.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";

import type { CommandPayload } from "../telegraf/bot/TelegramPayload.js";

export const LogoutCommandHandler = (args: {
  readonly command: CommandPayload<typeof Logout.command>;
}) =>
  Effect.gen(function* () {
    const sessionService = yield* SessionServiceTag;

    yield* sessionService.drop(args.command.idTelegramChat);

    const answer = yield* ArgazipaSayMdComponent({
      emotion: "👋",
      phrase: "До встречи",
    });

    return yield* pipe(
      args.command.replyWithMarkdown(answer, {}),
      Effect.either,
      Effect.tap(Effect.log)
    );
  });
