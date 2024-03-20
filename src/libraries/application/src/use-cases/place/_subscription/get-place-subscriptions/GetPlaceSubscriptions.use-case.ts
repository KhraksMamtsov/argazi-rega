import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceSubscriptionsCommandSchema } from "./GetPlaceSubscriptions.command.js";

import {
	PrismaServiceTag,
	SubscriptionDbToDomainSchema,
} from "@argazi/database";
import { _SS } from "@argazi/shared";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceSubscriptionsUseCase = BaseCausedUseCaseFor(
	GetPlaceSubscriptionsCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(
				Schema.array(SubscriptionDbToDomainSchema),
				(p) =>
					p.subscription.findMany({
						where: { idPlace: payload.idPlace },
					})
			)
		);
	})
);
