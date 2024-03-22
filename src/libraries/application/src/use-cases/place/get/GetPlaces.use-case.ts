import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PlaceDbToDomainSchema, PrismaServiceTag } from "@argazi/database";

import { GetPlacesCommandSchema } from "./GetPlaces.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlacesUseCase = BaseCausedUseCaseFor(GetPlacesCommandSchema)(
	() =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);

			return yield* _(
				prismaClient.queryDecode(Schema.array(PlaceDbToDomainSchema), (p) =>
					p.place.findMany({
						where: {
							dateDeleted: null,
							idUserDeleter: null,
						},
					})
				)
			);
		})
);
