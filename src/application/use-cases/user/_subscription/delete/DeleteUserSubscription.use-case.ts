import { Effect } from "effect";

import { DeleteUserSubscriptionCommandSchema } from "./DeleteUserSubscription.command.js";

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

		return yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.subscription.delete({
					where: { id: payload.idSubscription },
				})
			)
		);
	})
);
