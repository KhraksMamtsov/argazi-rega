import { Effect, Option } from "effect";

import { GetUserUseCase } from "@argazi/application";

import { JwtServiceTag } from "../Jwt.service.js";

import type { RefreshTokenRequestBody } from "./RefreshToken.endpoint.js";

export const RefreshTokenHandler = (body: RefreshTokenRequestBody) =>
  Effect.gen(function* (_) {
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
