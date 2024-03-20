import { Config, Effect, Option, Secret } from "effect";

import { webcrypto } from "node:crypto";

import { DwbnOAuth2Service } from "./DwbnOAuth2.service.js";

import { GetUserUseCase } from "../../../../application/use-cases/user/get/GetUser.use-case.js";
import { RegisterUserUseCase } from "../../../../application/use-cases/user/register/RegisterUser.use-case.js";
import { notification } from "../../../../libraries/domain/src/notification/Notification.js";
import { NotificationServiceTag } from "../../../../libraries/domain/src/services/NotificationService.js";
import { IdUserSchema } from "../../../../libraries/domain/src/user/entity/IdUser.js";
import { IdAdmin } from "../constants.js";
import { JwtServiceTag } from "../Jwt.service.js";

import type { LoginDwbnRequestBody } from "./LoginDwbn.endpoint.js";

export const LoginDwbnHandler = (body: LoginDwbnRequestBody) =>
	Effect.gen(function* (_) {
		const idDwbnAdmin = yield* _(Config.secret("DWBN_ID_ADMIN"));
		const notificationService = yield* _(NotificationServiceTag);
		const dwbnOAuth2Service = yield* _(DwbnOAuth2Service);

		const accessTokenResult = yield* _(dwbnOAuth2Service.fetchToken(body.code));

		const idTokenPayload = accessTokenResult.id_token[1];

		const registeredUserOption = yield* _(
			GetUserUseCase({
				payload: {
					idDwbn: idTokenPayload.sub,
					type: "idDwbn",
				},
			})
		);

		if (Option.isNone(registeredUserOption)) {
			const isAdmin = Secret.value(idDwbnAdmin) === idTokenPayload.sub;
			const idNewUser = IdUserSchema(
				isAdmin ? IdAdmin : webcrypto.randomUUID()
			);

			const newlyRegisteredUser = yield* _(
				RegisterUserUseCase({
					payload: {
						email: idTokenPayload.email,
						firstName: idTokenPayload.given_name,
						id: idNewUser,
						idDwbn: idTokenPayload.sub,
						idTelegramChat: body.idTelegramChat,
						isAdmin,
						lastName: idTokenPayload.family_name,
						phone: null,
						type: "ADULT",
					},
				})
			);

			Effect.runFork(
				notificationService.queue(
					notification.user("created")({
						idEntity: newlyRegisteredUser.id,
						idInitiator: newlyRegisteredUser.id,
					})
				)
			);

			return yield* _(
				JwtServiceTag.sign({
					isAdmin: newlyRegisteredUser.isAdmin,
					sub: newlyRegisteredUser.id,
				}),
				Effect.map((credentials) => ({
					credentials,
					idUser: newlyRegisteredUser.id,
				}))
			);
		} else {
			return yield* _(
				JwtServiceTag.sign({
					isAdmin: registeredUserOption.value.isAdmin,
					sub: registeredUserOption.value.id,
				}),
				Effect.map((credentials) => ({
					credentials,
					idUser: registeredUserOption.value.id,
				}))
			);
		}
	});
