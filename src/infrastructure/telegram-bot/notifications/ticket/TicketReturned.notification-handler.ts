import { Effect } from "effect";
import { Markup } from "telegraf";

import { TicketReturnedMdComponent } from "./TicketReturned.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";
import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

export const TicketReturnedNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly createdTicket: Ticket;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const restApiClient = yield* _(RestApiServiceTag);

		const event = yield* _(
			restApiClient.getEvent({
				params: {
					idEvent: args.createdTicket.idEvent,
				},
			})
		);

		const place = yield* _(
			restApiClient.getPlaceById({
				params: {
					idPlace: event.idPlace,
				},
			})
		);

		yield* _(
			args.bot.sendMessage(
				args.user.idTelegramChat,
				yield* _(
					TicketReturnedMdComponent({
						event,
						place,
						ticket: args.createdTicket,
					})
				),
				Markup.inlineKeyboard([yield* _(BookTicketCbButton({ id: event.id }))])
			)
		);
	});
