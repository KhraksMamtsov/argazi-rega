import { Config, Effect, Option, Redacted } from "effect";
import { Handler, HttpError } from "effect-http";

import { GetUserUseCase, RegisterUserUseCase } from "@argazi/application";
import { IdDwbn, IdTelegramChat } from "@argazi/domain";

import { IdAdmin, IdArgazipaBot } from "../constants.js";
import { JwtServiceTag } from "../Jwt.service.js";
import { LoginBasicEndpoint } from "@argazi/rest-api-spec";

export const LoginBasicHandler = Handler.make(
  LoginBasicEndpoint,
  (_, { pass, user }) =>
    Effect.gen(function* () {
      const loginResult = yield* _LoginBasicHandler({
        login: Redacted.make(user),
        password: Redacted.make(pass),
      });

      if (HttpError.isHttpError(loginResult)) {
        return yield* loginResult;
      }

      return loginResult;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
export const _LoginBasicHandler = (args: {
  readonly login: Redacted.Redacted;
  readonly password: Redacted.Redacted;
}) =>
  Effect.gen(function* () {
    const basicAuthSecrets = yield* Effect.all({
      adminLogin: Config.redacted("BASIC_AUTH_ADMIN_LOGIN_SECRET"),
      adminPassword: Config.redacted("BASIC_AUTH_ADMIN_PASSWORD_SECRET"),
      argazipaBotLogin: Config.redacted("BASIC_AUTH_BOT_LOGIN_SECRET"),
      argazipaBotPassword: Config.redacted("BASIC_AUTH_BOT_PASSWORD_SECRET"),
    });

    if (
      Redacted.value(basicAuthSecrets.argazipaBotLogin) ===
        Redacted.value(args.login) &&
      Redacted.value(basicAuthSecrets.argazipaBotPassword) ===
        Redacted.value(args.password)
    ) {
      const registeredArgazipaBotOption = yield* GetUserUseCase({
        payload: { id: IdArgazipaBot, type: "id" },
      });

      if (Option.isNone(registeredArgazipaBotOption)) {
        const newlyRegisteredArgazipaBot = yield* RegisterUserUseCase({
          payload: {
            email: "argazipa.bot@gmail.com",
            firstName: "Argazipa",
            id: IdArgazipaBot,
            idDwbn: IdDwbn.make("ArgazipaBot"),
            idTelegramChat: IdTelegramChat.make(0),
            isAdmin: true,
            lastName: "Bot",
            phone: null,
            type: "ADULT",
          },
        });

        return yield* JwtServiceTag.sign({
          isAdmin: newlyRegisteredArgazipaBot.isAdmin,
          sub: newlyRegisteredArgazipaBot.id,
        });
      }

      return yield* JwtServiceTag.sign({
        isAdmin: registeredArgazipaBotOption.value.isAdmin,
        sub: registeredArgazipaBotOption.value.id,
      });
    } else if (
      Redacted.value(basicAuthSecrets.adminLogin) ===
        Redacted.value(args.login) &&
      Redacted.value(basicAuthSecrets.adminPassword) ===
        Redacted.value(args.password)
    ) {
      const registeredAdminOption = yield* GetUserUseCase({
        payload: { id: IdAdmin, type: "id" },
      });

      if (Option.isNone(registeredAdminOption)) {
        return HttpError.notFound("Wrong secret");
      }

      return yield* JwtServiceTag.sign({
        isAdmin: registeredAdminOption.value.isAdmin,
        sub: registeredAdminOption.value.id,
      });
    }
    return HttpError.unauthorized("Wrong secret");
  });
