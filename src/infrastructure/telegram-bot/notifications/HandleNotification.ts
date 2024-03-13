import { Effect } from "effect";

import { EventCreatedNotificationHandler } from "./event/EventCreated.notification-handler.js";
import { TicketCreatedNotificationHandler } from "./ticket/TicketCreated.notification-handler.js";
import { TicketReturnedNotificationHandler } from "./ticket/TicketReturned.notification-handler.js";
import { UserCreatedNotificationHandler } from "./user/UserCreated.notification-handler.js";

import { type NotificationMessage } from "../../../domain/services/NotificationService.js";
import { IdAdmin } from "../../rest-api/authentication/constants.js";
import { RestApiServiceTag } from "../RestApiService.js";

import type { TelegrafBot } from "../telegraf/TelegrafBot.js";

export const handleNotification = (args: {
	readonly bot: TelegrafBot;
	readonly notificationMessage: NotificationMessage;
}) =>
	Effect.gen(function* (_) {
		const restApiClient = yield* _(RestApiServiceTag);
		const { notification } = args.notificationMessage;

		yield* _(args.notificationMessage.ack()); // TODO: get rid from start

		yield* _(Effect.logDebug(args.notificationMessage));

		const initiator = yield* _(
			restApiClient.getUser({ params: { idUser: notification.idInitiator } })
		);

		const { entity } = notification;

		if (entity.type === "User") {
			const affectedUser = yield* _(
				restApiClient.getUser({ params: { idUser: entity.id } })
			);

			if (notification.issue === "created") {
				yield* _(
					UserCreatedNotificationHandler({
						bot: args.bot,
						createdUser: affectedUser,
						initiator,
					})
				);

				yield* _(args.notificationMessage.ack());
			}
		}

		if (entity.type === "Event") {
			const affectedEvent = yield* _(
				restApiClient.getEvent({ params: { idEvent: entity.id } })
			);

			if (notification.issue === "created") {
				return yield* _(
					EventCreatedNotificationHandler({
						bot: args.bot,
						createdEvent: affectedEvent,
						initiator: initiator,
					})
				);
			}
		}

		if (entity.type === "Ticket") {
			const affectedTicket = yield* _(
				restApiClient.getUserTicketById({
					params: { idTicket: entity.id, idUser: IdAdmin },
				})
			);

			const user = yield* _(
				restApiClient.getUser({
					params: {
						idUser: affectedTicket.idUser,
					},
				})
			);

			if (notification.issue === "created") {
				return yield* _(
					TicketCreatedNotificationHandler({
						bot: args.bot,
						createdTicket: affectedTicket,
						initiator,
						user,
					})
				);
			}

			if (notification.issue === "deleted") {
				return yield* _(
					TicketReturnedNotificationHandler({
						bot: args.bot,
						createdTicket: affectedTicket,
						initiator,
						user,
					})
				);
			}
		}

		return Effect.unit;
	});
