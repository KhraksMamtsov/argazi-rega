import { Effect } from "effect";

import { DeleteUserSubscriptionCommandSchema } from "./DeleteUserSubscription.command.js";

import { notification } from "../../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../../infrastructure/database/entity/Subscription.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { DeleteEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const DeleteUserSubscriptionUseCase = BaseCausedUseCaseFor(
	DeleteUserSubscriptionCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		if (!initiator.isAdmin && initiator.id !== payload.idUser) {
			yield* _(
				new DeleteEntityAuthorizationError({
					entity: "Subscription",
					idEntity: payload.idSubscription,
					idInitiator: initiator.id,
					payload,
				})
			);
		}

		const prismaClient = yield* _(PrismaServiceTag);

		const deletedSubscription = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.subscription.update({
					data: {
						dateDeleted: new Date(),
						idUserDeleter: initiator.id,
					},
					where: {
						id: payload.idSubscription,
					},
				})
			)
		);

		const notificationService = yield* _(NotificationServiceTag);

		Effect.runFork(
			notificationService.queue(
				notification.subscription("deleted")({
					idEntity: deletedSubscription.id,
					idInitiator: initiator.id,
				})
			)
		);

		return deletedSubscription;
	})
);
