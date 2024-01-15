import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceByIdCommandSchema } from "./GetPlaceById.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/Place.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlaceByIdUseCase = BaseCausedUseCaseFor(
	GetPlaceByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.optionFromNullable(ToDomainSchema), (p) =>
				p.place.findUnique({ where: { id: payload.id } })
			)
		);
	})
);
