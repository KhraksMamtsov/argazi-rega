import { Effect } from "effect";

import { CreateSubscriptionCommandSchema } from "./CreateSubscription.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/Subscription.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { CreateEntityAuthorizationError } from "../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateSubscriptionUseCase = BaseCausedUseCaseFor(
	CreateSubscriptionCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);
		const notificationService = yield* _(NotificationServiceTag);

		if (!initiator.isAdmin && initiator.id !== payload.idUser) {
			yield* _(
				new CreateEntityAuthorizationError({
					entity: ["Subscription"],
					idInitiator: initiator.id,
					payload,
				})
			);
		}

		const newSubscription = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.subscription.create({
					data: {
						idPlace: payload.idPlace,
						idUser: payload.idUser,
						idUserCreator: initiator.id,
						idUserUpdater: initiator.id,
					},
				})
			)
		);

		Effect.runFork(
			notificationService.queue(
				notification.subscription("created")({
					idEntity: newSubscription.id,
					idInitiator: initiator.id,
				})
			)
		);

		return newSubscription;
	})
);
