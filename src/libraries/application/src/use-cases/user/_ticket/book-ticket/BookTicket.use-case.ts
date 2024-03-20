import { Effect } from "effect";

import { BookTicketCommandSchema } from "./BookTicket.command.js";

import { CreateEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";
import { PrismaServiceTag, TicketDbToDomainSchema } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

export const BookTicketUseCase = BaseCausedUseCaseFor(BookTicketCommandSchema)(
	({ payload, initiator }) =>
		Effect.gen(function* (_) {
			const prismaClient = yield* _(PrismaServiceTag);
			const notificationService = yield* _(NotificationServiceTag);

			if (!initiator.isAdmin && initiator.id !== payload.idUser) {
				yield* _(
					new CreateEntityAuthorizationError({
						entity: "Ticket",
						idInitiator: initiator.id,
						payload: payload,
					})
				);
			}

			const newTicket = yield* _(
				prismaClient.queryDecode(TicketDbToDomainSchema, (p) =>
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
