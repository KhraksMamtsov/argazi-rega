import { Schema, ParseResult } from "@effect/schema";
import { Config, Effect, Layer, ReadonlyRecord, Secret } from "effect";

import { IdUserSchema } from "@argazi/domain";
import { _SS, _JWT, _JWTError } from "@argazi/shared";

import { AccessTokenSchema, type AccessToken } from "./AccessToken.js";
import { RefreshTokenSchema, type RefreshToken } from "./RefreshToken.js";

// #region JWTPayload
export const _JWTPayloadSchema = Schema.struct({
	isAdmin: Schema.boolean,
	sub: IdUserSchema,
})
	.pipe(_SS.satisfies.from.json())
	.pipe(Schema.identifier("JWTPayloadSchema"));

export type JWTPayloadContext = Schema.Schema.Context<typeof _JWTPayloadSchema>;
export interface JWTPayloadEncoded
	extends Schema.Schema.Encoded<typeof _JWTPayloadSchema> {}
export interface JWTPayload
	extends Schema.Schema.Type<typeof _JWTPayloadSchema> {}

export const JWTPayloadSchema: Schema.Schema<JWTPayload, JWTPayloadEncoded> =
	_JWTPayloadSchema;
// #endregion JWTPayloadSchema

const encodeJWT = Schema.encode(JWTPayloadSchema);
const decodeJWT = Schema.decodeUnknown(JWTPayloadSchema);

type JWTPayloadSchema = Schema.Schema.Type<typeof JWTPayloadSchema>;

const makeLive = () =>
	Effect.gen(function* (_) {
		const jwtConfig = yield* _(
			Effect.all({
				accessTokenSecret: Config.secret("JWT_ACCESS_TOKEN_SECRET"),
				accessTokenTtl: Config.secret("JWT_ACCESS_TOKEN_TTL"),
				refreshTokenSecret: Config.secret("JWT_REFRESH_TOKEN_SECRET"),
				refreshTokenTtl: Config.secret("JWT_REFRESH_TOKEN_TTL"),
			}),
			Effect.map(ReadonlyRecord.map(Secret.value))
		);

		return {
			sign: (
				payload: JWTPayloadSchema
			): Effect.Effect<
				{
					accessToken: AccessToken;
					refreshToken: RefreshToken;
				},
				ParseResult.ParseError | _JWTError.JwtSignError
			> =>
				encodeJWT(payload).pipe(
					Effect.flatMap((encodedPayload) =>
						Effect.all({
							accessToken: _JWT
								.sign({
									expiresIn: jwtConfig.accessTokenTtl,
									key: jwtConfig.accessTokenSecret,
									payload: encodedPayload,
								})
								.pipe(
									Effect.map(Secret.fromString),
									Effect.map(AccessTokenSchema)
								),
							refreshToken: _JWT
								.sign({
									expiresIn: jwtConfig.refreshTokenTtl,
									key: jwtConfig.refreshTokenSecret,
									payload: encodedPayload,
								})
								.pipe(
									Effect.map(Secret.fromString),
									Effect.map(RefreshTokenSchema)
								),
						})
					)
				),
			verifyAndDecode: (args: {
				readonly token: Secret.Secret;
				readonly type: "accessToken" | "refreshToken";
			}): Effect.Effect<
				JWTPayload,
				ParseResult.ParseError | _JWTError.JwtVerifyError
			> =>
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
						})
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
