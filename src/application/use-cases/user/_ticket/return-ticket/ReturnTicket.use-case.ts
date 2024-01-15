import { Effect } from "effect";

import { ReturnTicketCommandSchema } from "./ReturnTicket.command.js";

import { notification } from "../../../../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../../../../domain/services/NotificationService.js";
import { ToDomainSchema } from "../../../../../infrastructure/database/entity/Ticket.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { CreateEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const ReturnTicketUseCase = BaseCausedUseCaseFor(
	ReturnTicketCommandSchema
)(({ payload, initiator }) =>
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

		const deletedTicket = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
				p.ticket.update({
					data: {
						dateDeleted: new Date(),
						idUserDeleter: initiator.id,
					},
					where: {
						id: payload.id,
						idUser: payload.idUser,
					},
				})
			)
		);

		Effect.runFork(
			notificationService.queue(
				notification.ticket("deleted")({
					idEntity: deletedTicket.id,
					idInitiator: initiator.id,
				})
			)
		);

		return deletedTicket;
	})
);
