import { Effect } from "effect";

import { BookTicketCommandSchema } from "./BookTicket.command.js";

import { notification } from "../../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../../infrastructure/database/entity/Ticket.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { CreateEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const BookTicketUseCase = BaseCausedUseCaseFor(BookTicketCommandSchema)(
	({ payload, initiator }) =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);
			const notificationService = yield* _(NotificationServiceTag);

			if (!initiator.isAdmin && initiator.id !== payload.idUser) {
				yield* _(
					new CreateEntityAuthorizationError({
						entity: ["User", "Ticket"],
						idInitiator: initiator.id,
						payload: payload,
					})
				);
			}

			const newTicket = yield* _(
				prismaClient.queryDecode(ToDomainSchema, (p) =>
					p.ticket.create({
						data: {
							...payload,
							idUserCreator: initiator.id,
							idUserUpdater: initiator.id,
							role: "NONE",
						},
					})
				)
			);

			Effect.runFork(
				notificationService.queue(
					notification.ticket("created")({
						idEntity: newTicket.id,
						idInitiator: initiator.id,
					})
				)
			);

			return newTicket;
		})
);
