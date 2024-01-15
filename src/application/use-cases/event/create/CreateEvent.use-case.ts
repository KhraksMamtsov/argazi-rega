import { Effect } from "effect";

import { CreateEventCommandSchema } from "./CreateEvent.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/Event.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateEventUseCase = BaseCausedUseCaseFor(
	CreateEventCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);
		const notificationService = yield* _(NotificationServiceTag);

		const newEvent = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.event.create({
					data: {
						dateAnnouncement: payload.dateAnnouncement,
						dateDeadline: payload.dateDeadline,
						dateFinish: payload.dateFinish,
						dateStart: payload.dateStart,
						idPlace: payload.idPlace,
						idUserCreator: initiator.id,
						idUserUpdater: initiator.id,
						name: payload.name,
						priceDay: payload.priceDay,
						priceEvent: payload.priceEvent,
					},
				})
			)
		);

		Effect.runFork(
			notificationService.queue(
				notification.event("created")({
					idEntity: newEvent.id,
					idInitiator: initiator.id,
				})
			)
		);

		return newEvent;
	})
);
