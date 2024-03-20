import { Schema } from "@effect/schema";
import { Config, Effect, Layer, ReadonlyRecord, Secret } from "effect";

import { AccessTokenSchema } from "./AccessToken.js";
import { RefreshTokenSchema } from "./RefreshToken.js";

import { _SS, _JWT } from "@argazi/shared";
import { IdUserSchema } from "@argazi/domain";

const JWTPayloadSchema = Schema.struct({
	isAdmin: Schema.boolean,
	sub: IdUserSchema,
}).pipe(_SS.satisfies.from.json());

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
			sign: (payload: JWTPayloadSchema) =>
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
						})
					),
		};
	});

export type JwtService = Effect.Effect.Success<ReturnType<typeof makeLive>>;

export class JwtServiceTag extends Effect.Tag("@argazi/infrastructure/rest")<
	JwtServiceTag,
	JwtService
>() {
	public static readonly Live = Layer.effect(JwtServiceTag, makeLive());
}
