import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetSubscriptionByIdCommandSchema } from "./GetSubscriptionById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";
import {
	PrismaServiceTag,
	SubscriptionDbToDomainSchema,
} from "@argazi/database";

export const GetSubscriptionByIdUseCase = BaseCausedUseCaseFor(
	GetSubscriptionByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(
				Schema.optionFromNullable(SubscriptionDbToDomainSchema),
				(p) =>
					p.subscription.findUnique({ where: { id: payload.idSubscription } })
			)
		);
	})
);
