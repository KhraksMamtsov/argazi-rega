import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlacesCommandSchema } from "./GetPlaces.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/Place.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlacesUseCase = BaseCausedUseCaseFor(GetPlacesCommandSchema)(
	() =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);

			return yield* _(
				prismaClient.queryDecode(Schema.array(ToDomainSchema), (p) =>
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
