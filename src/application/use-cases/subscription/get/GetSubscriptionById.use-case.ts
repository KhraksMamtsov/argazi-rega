import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetSubscriptionByIdCommandSchema } from "./GetSubscriptionById.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/Subscription.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetSubscriptionByIdUseCase = BaseCausedUseCaseFor(
	GetSubscriptionByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.optionFromNullable(ToDomainSchema), (p) =>
				p.subscription.findUnique({ where: { id: payload.idSubscription } })
			)
		);
	})
);
