import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetPlaceActualEventsCommandSchema } from "./GetPlaceActualEvents.command.js";

import { EventDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";
import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceActualEventsUseCase = BaseGetCausedUseCaseFor(
	GetPlaceActualEventsCommandSchema
)(({ payload }, { includeDeleted }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(Schema.array(EventDbToDomainSchema), (p) =>
				p.event.findMany({
					orderBy: { dateStart: "desc" },
					where: {
						...(includeDeleted ? {} : { idUserDeleter: null }),
						dateAnnouncement: { lte: new Date() },
						dateFinish: { gte: new Date() },
						idPlace: payload.idPlace,
					},
				})
			)
		);
	})
);
