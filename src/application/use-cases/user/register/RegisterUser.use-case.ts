import { Effect, Option, Secret } from "effect";

import { RegisterUserCommandSchema } from "./RegisterUser.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/User.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseUseCaseFor } from "../../common/Base.use-case.js";

export const RegisterUserUseCase = BaseUseCaseFor(RegisterUserCommandSchema)(
	({ payload }) =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);
			const notificationService = yield* _(NotificationServiceTag);

			const newUser = yield* _(
				prismaClient.queryDecode(ToDomainSchema, (p) =>
					p.user.create({
						data: {
							...payload,
							email: Secret.value(payload.email),
							firstName: Secret.value(payload.firstName),
							idUserCreator: payload.id,
							idUserUpdater: payload.id,
							lastName: Option.map(payload.lastName, Secret.value).pipe(
								Option.getOrNull
							),
							phone: Option.map(payload.phone, Secret.value).pipe(
								Option.getOrNull
							),
						},
					})
				)
			);

			if (!newUser.isAdmin) {
				Effect.runFork(
					notificationService.queue(
						notification.user("created")({
							idEntity: newUser.id,
							idInitiator: newUser.id,
						})
					)
				);
			}

			return newUser;
		})
);
