import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceGeoPointCommandSchema } from "./GetPlaceGeoPoint.command.js";

import { ToDomainSchema } from "../../../../../infrastructure/database/entity/GeoPoint.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceGeoPointUseCase = BaseCausedUseCaseFor(
	GetPlaceGeoPointCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.optionFromNullable(ToDomainSchema), (p) =>
				p.place
					.findUnique({
						include: { geoPoint: true },
						where: { id: payload.idPlace },
					})
					.then((x) => x?.geoPoint ?? null)
			)
		);
	})
);
