import { Schema, ParseResult } from "@effect/schema";
import { Config, Effect, Layer, Record, Secret, Data, pipe } from "effect";

import { IdUser } from "@argazi/domain";
import { _SS, _JWT } from "@argazi/shared";

import { AccessToken } from "./AccessToken.js";
import { RefreshToken } from "./RefreshToken.js";

// #region JWTPayload
export const _JWTPayload = Schema.Struct({
  isAdmin: Schema.Boolean,
  sub: IdUser,
})
  .pipe(_SS.satisfies.encoded.json())
  .pipe(Schema.identifier("JWTPayload"));

export type _JWTPayloadContext = Schema.Schema.Context<typeof _JWTPayload>;
export interface JWTPayloadEncoded
  extends Schema.Schema.Encoded<typeof _JWTPayload> {}
export interface JWTPayload extends Schema.Schema.Type<typeof _JWTPayload> {}

export const JWTPayload: Schema.Schema<JWTPayload, JWTPayloadEncoded> =
  _JWTPayload;
// #endregion JWTPayloadSchema

const encodeJWT = Schema.encode(JWTPayload);
const decodeJWT = Schema.decodeUnknown(JWTPayload);

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
  Effect.gen(function* (_) {
    const jwtConfig = yield* pipe(
      Effect.all({
        accessTokenSecret: Config.secret("JWT_ACCESS_TOKEN_SECRET"),
        accessTokenTtl: Config.secret("JWT_ACCESS_TOKEN_TTL"),
        refreshTokenSecret: Config.secret("JWT_REFRESH_TOKEN_SECRET"),
        refreshTokenTtl: Config.secret("JWT_REFRESH_TOKEN_TTL"),
      }),
      Effect.map(Record.map(Secret.value))
    );

    return {
      sign: (payload: JWTPayload) =>
        encodeJWT(payload).pipe(
          Effect.flatMap((encodedPayload) =>
            Effect.all({
              accessToken: _JWT
                .sign({
                  expiresIn: jwtConfig.accessTokenTtl,
                  key: jwtConfig.accessTokenSecret,
                  payload: encodedPayload,
                })
                .pipe(Effect.map(Secret.fromString), Effect.map(AccessToken)),
              refreshToken: _JWT
                .sign({
                  expiresIn: jwtConfig.refreshTokenTtl,
                  key: jwtConfig.refreshTokenSecret,
                  payload: encodedPayload,
                })
                .pipe(Effect.map(Secret.fromString), Effect.map(RefreshToken)),
            })
          ),
          Effect.mapError((cause) => new JWRServiceSignError({ cause }))
        ),
      verifyAndDecode: (args: {
        readonly token: Secret.Secret;
        readonly type: "accessToken" | "refreshToken";
      }) =>
        _JWT
          .verifyAndDecode({
            key: jwtConfig[`${args.type}Secret`],
            token: Secret.value(args.token),
          })
          .pipe(
            Effect.flatMap(decodeJWT),
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
