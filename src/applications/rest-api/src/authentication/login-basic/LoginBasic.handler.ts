import { Config, Effect, Option, Secret } from "effect";
import { HttpError } from "effect-http";

import { GetUserUseCase, RegisterUserUseCase } from "@argazi/application";
import { IdDwbn, IdTelegramChat } from "@argazi/domain";

import { IdAdmin, IdArgazipaBot } from "../constants.js";
import { JwtServiceTag } from "../Jwt.service.js";

export const LoginBasicHandler = (args: {
  readonly login: Secret.Secret;
  readonly password: Secret.Secret;
}) =>
  Effect.gen(function* (_) {
    const basicAuthSecrets = yield* Effect.all({
      adminLogin: Config.secret("BASIC_AUTH_ADMIN_LOGIN_SECRET"),
      adminPassword: Config.secret("BASIC_AUTH_ADMIN_PASSWORD_SECRET"),
      argazipaBotLogin: Config.secret("BASIC_AUTH_BOT_LOGIN_SECRET"),
      argazipaBotPassword: Config.secret("BASIC_AUTH_BOT_PASSWORD_SECRET"),
    });

    if (
      Secret.value(basicAuthSecrets.argazipaBotLogin) ===
        Secret.value(args.login) &&
      Secret.value(basicAuthSecrets.argazipaBotPassword) ===
        Secret.value(args.password)
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
      Secret.value(basicAuthSecrets.adminLogin) === Secret.value(args.login) &&
      Secret.value(basicAuthSecrets.adminPassword) ===
        Secret.value(args.password)
    ) {
      const registeredAdminOption = yield* GetUserUseCase({
        payload: { id: IdAdmin, type: "id" },
      });

      if (Option.isNone(registeredAdminOption)) {
        return HttpError.notFoundError("Wrong secret");
      }

      return yield* JwtServiceTag.sign({
        isAdmin: registeredAdminOption.value.isAdmin,
        sub: registeredAdminOption.value.id,
      });
    }
    return HttpError.unauthorizedError("Wrong secret");
  });
