import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetEventByIdCommandSchema } from "./GetEventById.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/Event.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetEventByIdUseCase = BaseCausedUseCaseFor(
	GetEventByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.optionFromNullable(ToDomainSchema), (p) =>
				p.event.findUnique({ where: { id: payload.id } })
			)
		);
	})
);
