import {
  BearerAuthentication,
  UnauthorizedHttpError,
} from "@argazi/rest-api-spec";
import { Effect, Layer, Redacted } from "effect";
import { JwtServiceTag } from "../authentication/Jwt.service.js";

export const BearerAuthenticationLive = Layer.effect(
  BearerAuthentication,
  Effect.gen(function* () {
    yield* Effect.log("creating Authorization middleware");
    const jwtService = yield* JwtServiceTag;

    return BearerAuthentication.of({
      authBearer: (token) =>
        Effect.gen(function* () {
          yield* Effect.log("checking bearer token", Redacted.value(token));
          const jwtPayload = yield* jwtService
            .verifyAndDecode({
              token,
              type: "accessToken",
            })
            .pipe(Effect.mapError((_x) => new UnauthorizedHttpError()));
          return { jwtPayload };
        }),
    });
  })
);
