import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceSubscriptionsCommandSchema } from "./GetPlaceSubscriptions.command.js";

import { ToDomainSchema } from "../../../../../infrastructure/database/entity/Subscription.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceSubscriptionsUseCase = BaseCausedUseCaseFor(
	GetPlaceSubscriptionsCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.array(ToDomainSchema), (p) =>
				p.subscription.findMany({
					where: { idPlace: payload.idPlace },
				})
			)
		);
	})
);
