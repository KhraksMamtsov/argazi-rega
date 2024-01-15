import { Effect, Option } from "effect";

import { GetUserUseCase } from "../../../../application/use-cases/user/get/GetUser.use-case.js";
import { JwtServiceTag } from "../Jwt.service.js";

import type { RefreshTokenRequestBody } from "./RefreshToken.api.js";

export const RefreshTokenHandler = (body: RefreshTokenRequestBody) =>
	Effect.gen(function* (_) {
		const jwtService = yield* _(JwtServiceTag);

		const refreshTokenPayload = yield* _(
			jwtService.verifyAndDecode({
				token: body.refreshToken,
				type: "refreshToken",
			})
		);

		const registeredUserOption = yield* _(
			GetUserUseCase({
				payload: { id: refreshTokenPayload.sub, type: "id" },
			})
		);

		if (Option.isSome(registeredUserOption)) {
			const tokens = yield* _(
				jwtService.sign({
					isAdmin: registeredUserOption.value.isAdmin,
					sub: registeredUserOption.value.id,
				})
			);
			return Option.some(tokens);
		} else {
			return Option.none();
		}
	});
