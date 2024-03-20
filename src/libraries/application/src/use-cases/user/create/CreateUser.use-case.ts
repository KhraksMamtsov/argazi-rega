import { Effect } from "effect";

import { CreateUserCommandSchema } from "./CreateUser.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";
import { PrismaServiceTag, UserDbToDomainSchema } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

export const CreateUserUseCase = BaseCausedUseCaseFor(CreateUserCommandSchema)(
	({ payload, initiator }) =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);
			const notificationService = yield* _(NotificationServiceTag);

			const newUser = yield* _(
				prismaClient.queryDecode(UserDbToDomainSchema, (p) =>
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
