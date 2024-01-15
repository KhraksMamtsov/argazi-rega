import { Effect } from "effect";

import { CreateUserCommandSchema } from "./CreateUser.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/User.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateUserUseCase = BaseCausedUseCaseFor(CreateUserCommandSchema)(
	({ payload, initiator }) =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);
			const notificationService = yield* _(NotificationServiceTag);

			const newUser = yield* _(
				prismaClient.queryDecode(ToDomainSchema, (p) =>
					p.user.create({
						data: {
							...payload,
							idUserCreator: initiator.id,
							idUserUpdater: initiator.id,
							isAdmin: false,
						},
					})
				)
			);

			Effect.runFork(
				notificationService.queue(
					notification.user("created")({
						idEntity: newUser.id,
						idInitiator: initiator.id,
					})
				)
			);

			return newUser;
		})
);
