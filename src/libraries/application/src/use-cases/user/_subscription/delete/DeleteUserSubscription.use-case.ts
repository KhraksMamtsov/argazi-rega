import { Effect } from "effect";

import {
	PrismaServiceTag,
	SubscriptionDbToDomainSchema,
} from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { DeleteUserSubscriptionCommandSchema } from "./DeleteUserSubscription.command.js";

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
			prismaClient.queryDecode(SubscriptionDbToDomainSchema, (p) =>
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
