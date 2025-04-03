import { Config, Effect, Layer, Redacted, Data, ParseResult } from "effect";

import { _JWT } from "@argazi/shared";
import { AccessToken, JWTPayload, RefreshToken } from "@argazi/rest-api-spec";
import { IdUser } from "@argazi/domain";

export enum JWTServiceErrorType {
  SIGN = "SIGN::JWTServiceErrorType",
  VERIFY = "VERIFY::JWTServiceErrorType",
}

export class JWRServiceSignError extends Data.TaggedError(
  JWTServiceErrorType.SIGN
)<{
  readonly cause: ParseResult.ParseError | _JWT.JwtSignError;
}> {}
export class JWRServiceVerifyError extends Data.TaggedError(
  JWTServiceErrorType.VERIFY
)<{
  readonly cause: ParseResult.ParseError | _JWT.JwtVerifyError;
}> {}

const makeLive = () =>
  Effect.gen(function* () {
    const jwtConfig = yield* Config.all({
      accessTokenSecret: Config.redacted("JWT_ACCESS_TOKEN_SECRET"),
      accessTokenTtl: Config.duration("JWT_ACCESS_TOKEN_TTL"),
      refreshTokenSecret: Config.redacted("JWT_REFRESH_TOKEN_SECRET"),
      refreshTokenTtl: Config.duration("JWT_REFRESH_TOKEN_TTL"),
    });

    return {
      sign: (payload: JWTPayload) =>
        JWTPayload.encode(payload).pipe(
          Effect.flatMap((encodedPayload) =>
            Effect.all({
              accessToken: _JWT
                .sign({
                  expiresIn: jwtConfig.accessTokenTtl,
                  key: jwtConfig.accessTokenSecret,
                  payload: encodedPayload,
                })
                .pipe(Effect.map(AccessToken.make)),
              refreshToken: _JWT
                .sign({
                  expiresIn: jwtConfig.refreshTokenTtl,
                  key: jwtConfig.refreshTokenSecret,
                  payload: encodedPayload,
                })
                .pipe(Effect.map(RefreshToken.make)),
            })
          ),
          Effect.mapError((cause) => new JWRServiceSignError({ cause }))
        ),
      verifyAndDecode: (args: {
        readonly token: Redacted.Redacted;
        readonly type: "accessToken" | "refreshToken";
      }) =>
        _JWT
          .verifyAndDecode({
            key: jwtConfig[`${args.type}Secret`],
            token: args.token,
          })
          .pipe(
            Effect.flatMap(JWTPayload.decode),
            Effect.map((x) => ({
              ...x,
              sub: IdUser.make(x.sub),
            })),
            Effect.tapBoth({
              onFailure: Effect.logError,
              onSuccess: Effect.logDebug,
            }),
            Effect.mapError((cause) => new JWRServiceVerifyError({ cause }))
          ),
    };
  });

export interface JwtService
  extends Effect.Effect.Success<ReturnType<typeof makeLive>> {}

export class JwtServiceTag extends Effect.Tag("@argazi/infrastructure/rest")<
  JwtServiceTag,
  JwtService
>() {
  public static readonly Live = Layer.effect(JwtServiceTag, makeLive());
}
