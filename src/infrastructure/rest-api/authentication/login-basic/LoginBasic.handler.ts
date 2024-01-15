import { Config, Effect, Option, Secret } from "effect";
import { ServerError } from "effect-http";

import { GetUserUseCase } from "../../../../application/use-cases/user/get/GetUser.use-case.js";
import { RegisterUserUseCase } from "../../../../application/use-cases/user/register/RegisterUser.use-case.js";
import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdTelegramChatSchema } from "../../../../domain/user/entity/IdTelegramChat.js";
import { IdAdmin, IdArgazipaBot } from "../constants.js";
import { JwtServiceTag } from "../Jwt.service.js";

export const LoginBasicHandler = (args: { readonly token: Secret.Secret }) =>
	Effect.gen(function* (_) {
		const jwtService = yield* _(JwtServiceTag);
		const basicAuthSecrets = yield* _(
			Effect.all({
				admin: Config.secret("BASIC_AUTH_ADMIN_SECRET"),
				argazipaBot: Config.secret("BASIC_AUTH_BOT_SECRET"),
			})
		);

		if (
			Secret.value(basicAuthSecrets.argazipaBot) === Secret.value(args.token)
		) {
			const registeredArgazipaBotOption = yield* _(
				GetUserUseCase({ payload: { id: IdArgazipaBot, type: "id" } })
			);

			if (Option.isNone(registeredArgazipaBotOption)) {
				const newlyRegisteredArgazipaBot = yield* _(
					RegisterUserUseCase({
						payload: {
							email: "argazipa.bot@gmail.com",
							firstName: "Argazipa",
							id: IdArgazipaBot,
							idDwbn: IdDwbnSchema("ArgazipaBot"),
							idTelegramChat: IdTelegramChatSchema(0),
							isAdmin: true,
							lastName: "Bot",
							phone: null,
							type: "ADULT",
						},
					})
				);

				return yield* _(
					jwtService.sign({
						isAdmin: newlyRegisteredArgazipaBot.isAdmin,
						sub: newlyRegisteredArgazipaBot.id,
					})
				);
			}

			return yield* _(
				jwtService.sign({
					isAdmin: registeredArgazipaBotOption.value.isAdmin,
					sub: registeredArgazipaBotOption.value.id,
				})
			);
		} else if (
			Secret.value(basicAuthSecrets.admin) === Secret.value(args.token)
		) {
			const registeredAdminOption = yield* _(
				GetUserUseCase({ payload: { id: IdAdmin, type: "id" } })
			);

			if (Option.isNone(registeredAdminOption)) {
				return ServerError.notFoundError("Wrong secret");
			}

			return yield* _(
				jwtService.sign({
					isAdmin: registeredAdminOption.value.isAdmin,
					sub: registeredAdminOption.value.id,
				})
			);
		} else {
			return ServerError.unauthorizedError("Wrong secret");
		}
	});
