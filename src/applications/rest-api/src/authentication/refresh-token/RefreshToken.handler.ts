import { Effect, Option } from "effect";

import { GetUserUseCase } from "@argazi/application";

import { JwtServiceTag } from "../Jwt.service.js";

import {
  RefreshTokenEndpoint,
  type RefreshTokenRequestBody,
} from "./RefreshToken.endpoint.js";
import { Handler, HttpError } from "effect-http";

export const RefreshTokenHandler = Handler.make(
  RefreshTokenEndpoint,
  ({ body }) =>
    Effect.gen(function* () {
      const loginResult = yield* _RefreshTokenHandler(body);

      if (Option.isNone(loginResult)) {
        return yield* HttpError.unauthorized({
          content: "User not found",
        });
      }

      return loginResult.value;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
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
