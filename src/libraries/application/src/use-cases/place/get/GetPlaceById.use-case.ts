import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceByIdCommandSchema } from "./GetPlaceById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";
import { PlaceDbToDomainSchema, PrismaServiceTag } from "@argazi/database";

export const GetPlaceByIdUseCase = BaseCausedUseCaseFor(
	GetPlaceByIdCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(
				Schema.optionFromNullable(PlaceDbToDomainSchema),
				(p) => p.place.findUnique({ where: { id: payload.id } })
			)
		);
	})
);
