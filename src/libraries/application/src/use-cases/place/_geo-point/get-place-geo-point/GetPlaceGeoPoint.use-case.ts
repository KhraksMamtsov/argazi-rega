import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceGeoPointCommandSchema } from "./GetPlaceGeoPoint.command.js";

import { PlaceDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceGeoPointUseCase = BaseCausedUseCaseFor(
	GetPlaceGeoPointCommandSchema
)(({ payload }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(
				Schema.optionFromNullable(PlaceDbToDomainSchema),
				(p) =>
					p.place.findUnique({
						include: { geoPoint: true },
						where: { id: payload.idPlace },
					})
			)
		);
	})
);
