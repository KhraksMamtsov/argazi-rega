import { Config, Effect, Option, pipe, Redacted } from "effect";

import { webcrypto } from "node:crypto";

import { GetUserUseCase } from "@argazi/application";
import { RegisterUserUseCase } from "@argazi/application";
import { notification } from "@argazi/domain";
import { NotificationServiceTag } from "@argazi/domain";
import { IdUser } from "@argazi/domain";

import { DwbnOAuth2Service } from "./DwbnOAuth2.service.js";

import { IdAdmin } from "../constants.js";
import { JwtServiceTag } from "../Jwt.service.js";

import { Handler } from "effect-http";
import { LoginDwbnEndpoint } from "@argazi/rest-api-spec";

export const LoginDwbnHandler = Handler.make(LoginDwbnEndpoint, ({ body }) =>
  Effect.gen(function* () {
    const idDwbnAdmin = yield* Config.redacted("DWBN_ID_ADMIN");
    const notificationService = yield* NotificationServiceTag;
    const dwbnOAuth2Service = yield* DwbnOAuth2Service;

    const accessTokenResult = yield* dwbnOAuth2Service.fetchToken(body.code);

    const idTokenPayload = accessTokenResult.id_token[1];

    const registeredUserOption = yield* GetUserUseCase({
      payload: {
        idDwbn: idTokenPayload.sub,
        type: "idDwbn",
      },
    });

    if (Option.isNone(registeredUserOption)) {
      const isAdmin = Redacted.value(idDwbnAdmin) === idTokenPayload.sub;
      const idNewUser = IdUser.make(isAdmin ? IdAdmin : webcrypto.randomUUID());

      const newlyRegisteredUser = yield* RegisterUserUseCase({
        payload: {
          email: idTokenPayload.email,
          firstName: idTokenPayload.given_name,
          id: idNewUser,
          idDwbn: idTokenPayload.sub,
          idTelegramChat: body.idTelegramChat,
          isAdmin,
          lastName: idTokenPayload.family_name,
          phone: null,
          type: "ADULT",
        },
      });

      Effect.runFork(
        notificationService.queue(
          notification.user("created")({
            idEntity: newlyRegisteredUser.id,
            idInitiator: newlyRegisteredUser.id,
          })
        )
      );

      return yield* pipe(
        JwtServiceTag.sign({
          isAdmin: newlyRegisteredUser.isAdmin,
          sub: newlyRegisteredUser.id,
        }),
        Effect.map((credentials) => ({
          credentials,
          idUser: newlyRegisteredUser.id,
        }))
      );
    } else {
      return yield* pipe(
        JwtServiceTag.sign({
          isAdmin: registeredUserOption.value.isAdmin,
          sub: registeredUserOption.value.id,
        }),
        Effect.map((credentials) => ({
          credentials,
          idUser: registeredUserOption.value.id,
        }))
      );
    }
  }).pipe(
    Effect.tapBoth({
      onFailure: Effect.logError,
      onSuccess: Effect.logInfo,
    })
  )
);
