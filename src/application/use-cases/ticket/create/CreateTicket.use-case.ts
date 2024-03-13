import { Effect, Option } from "effect";

import { CreateTicketCommandSchema } from "./CreateTicket.command.js";

import { notification } from "../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../infrastructure/database/entity/Ticket.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { CreateEntityAuthorizationError } from "../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateTicketUseCase = BaseCausedUseCaseFor(
	CreateTicketCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);
		const notificationService = yield* _(NotificationServiceTag);

		if (!initiator.isAdmin && initiator.id !== payload.idUser) {
			yield* _(
				new CreateEntityAuthorizationError({
					entity: "Ticket",
					idInitiator: initiator.id,
					payload: {
						...payload,
						dateRegistered: payload.dateRegistered.toISOString(),
						idTransport: Option.getOrNull(payload.idTransport),
					},
				})
			);
		}

		const newSubscription = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.ticket.create({
					data: {
						...payload,
						idTransport: Option.getOrNull(payload.idTransport),
						idUserCreator: initiator.id,
						idUserUpdater: initiator.id,
					},
				})
			)
		);

		Effect.runFork(
			notificationService.queue(
				notification.ticket("created")({
					idEntity: newSubscription.id,
					idInitiator: initiator.id,
				})
			)
		);

		return newSubscription;
	})
);
