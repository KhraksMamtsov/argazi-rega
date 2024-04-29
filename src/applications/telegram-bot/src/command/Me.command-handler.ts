import { Effect, pipe } from "effect";

import { Me } from "./TelegramCommands.js";

import { RestApiServiceTag } from "../RestApiService.js";
import { UserMdComponent } from "../ui/User.md-component.js";

import type { CommandPayload } from "../telegraf/bot/TelegramPayload.js";

export const MeCommandHandler = (args: {
  readonly command: CommandPayload<typeof Me.command>;
}) =>
  Effect.gen(function* (_) {
    const restApiService = yield* RestApiServiceTag;
    const restApiUserClient = yield* restApiService.__new.getUserApiClientFor(
      args.command.idTelegramChat
    );

    const myIdentity = yield* restApiUserClient.getMyIdentity({});

    const answer = yield* UserMdComponent({ user: myIdentity });

    return yield* pipe(
      args.command.replyWithMarkdown(answer, {}),
      Effect.either,
      Effect.tap(Effect.log)
    );
  });
