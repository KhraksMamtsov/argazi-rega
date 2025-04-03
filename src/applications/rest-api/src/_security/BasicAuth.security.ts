import {
  BasicAuthentication,
  UnauthorizedHttpError,
} from "@argazi/rest-api-spec";
import { Config, Effect, Layer, Redacted } from "effect";

export const BasicAuthenticationLive = Layer.effect(
  BasicAuthentication,
  Effect.gen(function* () {
    const basicAuthSecrets = yield* Config.all({
      adminLogin: Config.redacted("BASIC_AUTH_ADMIN_LOGIN_SECRET"),
      adminPassword: Config.redacted("BASIC_AUTH_ADMIN_PASSWORD_SECRET"),
      argazipaBotLogin: Config.redacted("BASIC_AUTH_BOT_LOGIN_SECRET"),
      argazipaBotPassword: Config.redacted("BASIC_AUTH_BOT_PASSWORD_SECRET"),
    });

    return BasicAuthentication.of({
      authBasic: (credentials) =>
        Effect.gen(function* () {
          if (
            Redacted.value(basicAuthSecrets.argazipaBotLogin) ===
              credentials.username &&
            Redacted.value(basicAuthSecrets.argazipaBotPassword) ===
              Redacted.value(credentials.password)
          ) {
            return { type: "bot" } as const;
          }
          if (
            Redacted.value(basicAuthSecrets.adminLogin) ===
              credentials.username &&
            Redacted.value(basicAuthSecrets.adminPassword) ===
              Redacted.value(credentials.password)
          ) {
            return { type: "admin" } as const;
          }

          return yield* Effect.fail(new UnauthorizedHttpError());
        }),
    });
  })
);
