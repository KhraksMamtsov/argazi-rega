import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetEventByIdCommandSchema } from "./GetEventById.command.js";

import { EventDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetEventByIdUseCase = BaseCausedUseCaseFor(
	GetEventByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(
				Schema.optionFromNullable(EventDbToDomainSchema),
				(p) => p.event.findUnique({ where: { id: payload.id } })
			)
		);
	})
);
