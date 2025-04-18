import { Schema } from "effect";
import { Effect, Either } from "effect";
import { constVoid, pipe } from "effect/Function";

import { IdTelegramChat } from "@argazi/domain";

import { RestApiServiceTag } from "./RestApiService.js";
import { SessionServiceTag } from "./Session.service.js";
import { TelegramAuthMiniAppData } from "./TelegramAuthMiniAppData.js";
import { ArgazipaSayMdComponent } from "./ui/ArgazipaSay.md-component.js";
import { MD } from "./ui/Markdown.js";
import { UserMdComponent } from "./ui/User.md-component.js";

import type { WebAppDataPayload } from "./telegraf/bot/TelegramPayload.js";

export const decode = Schema.decode(TelegramAuthMiniAppData);

export const AuthenticationHandler = (webAppDataPayload: WebAppDataPayload) =>
  Effect.gen(function* () {
    const restApiService = yield* RestApiServiceTag;

    const authenticationData = yield* decode(
      webAppDataPayload.message.web_app_data.data
    ).pipe(Effect.tapError(Effect.logError));

    const idTelegramChat = IdTelegramChat.make(
      webAppDataPayload.message.chat.id
    );

    const authenticationResult = yield* pipe(
      restApiService.loginDwbn({
        body: {
          code: authenticationData.data.code,
          idTelegramChat,
        },
      }),
      Effect.either
    );

    if (Either.isLeft(authenticationResult)) {
      constVoid(); // TODO: error
      return;
    }

    yield* SessionServiceTag.create(idTelegramChat, {
      accessToken: authenticationResult.right.credentials.accessToken,
      refreshToken: authenticationResult.right.credentials.refreshToken,
    });

    const restApiUserClient =
      yield* restApiService.__new.getUserApiClientFor(idTelegramChat);

    const myIdentity = yield* restApiUserClient
      .getMyIdentity({
        headers: {},
      })
      .pipe(Effect.tapError(Effect.logError));

    const answerText = yield* MD.document(
      ArgazipaSayMdComponent({ emotion: "🙏", phrase: "Добро пожаловать" }),
      MD.br,
      UserMdComponent({ user: myIdentity })
    );

    return yield* webAppDataPayload.replyWithMarkdown(answerText, {
      reply_markup: { remove_keyboard: true },
    });
  });
