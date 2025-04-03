import { Effect, Option } from "effect";

import { GetUserUseCase } from "@argazi/application";

import { JwtServiceTag } from "../Jwt.service.js";

import {
  RefreshTokenRequestBody,
  RestApiSpec,
  UnauthorizedHttpError,
} from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const RefreshTokenHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Authentication",
  "refreshToken",
  ({ payload }) =>
    Effect.gen(function* () {
      const loginResult = yield* _RefreshTokenHandler(payload);

      if (Option.isNone(loginResult)) {
        return yield* new UnauthorizedHttpError();
      }

      return loginResult.value;
    }).pipe(Effect.orDie)
);

export const _RefreshTokenHandler = (body: RefreshTokenRequestBody) =>
  Effect.gen(function* () {
    const refreshTokenPayload = yield* JwtServiceTag.verifyAndDecode({
      token: body.refreshToken,
      type: "refreshToken",
    });

    const registeredUserOption = yield* GetUserUseCase({
      payload: { id: refreshTokenPayload.sub, type: "id" },
    });

    if (Option.isSome(registeredUserOption)) {
      const tokens = yield* JwtServiceTag.sign({
        isAdmin: registeredUserOption.value.isAdmin,
        sub: registeredUserOption.value.id,
      });
      return Option.some(tokens);
    } else {
      return Option.none();
    }
  });
