import { Effect, Option, Secret } from "effect";

import { CreateGeoPointCommandSchema } from "./CreateGeoPoint.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/GeoPoint.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateGeoPointUseCase = BaseCausedUseCaseFor(
	CreateGeoPointCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);
		const notificationService = yield* _(NotificationServiceTag);

		const newGeoPoint = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.geoPoint.create({
					data: {
						...payload,
						idUserCreator: initiator.id,
						idUserUpdater: initiator.id,
						name: payload.name.pipe(Option.map(Secret.value), Option.getOrNull),
					},
				})
			)
		);

		Effect.runFork(
			notificationService.queue(
				notification.geoPoint("created")({
					idEntity: newGeoPoint.id,
					idInitiator: initiator.id,
				})
			)
		);

		return newGeoPoint;
	})
);
