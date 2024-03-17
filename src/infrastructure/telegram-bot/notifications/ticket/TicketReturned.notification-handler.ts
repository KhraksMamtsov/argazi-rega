import { Effect } from "effect";
import { Markup } from "telegraf";

import { TicketReturnedMdComponent } from "./TicketReturned.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";
import type { User } from "../../../../domain/user/entity/User.js";

export const TicketReturnedNotificationHandler = (args: {
	readonly createdTicket: Ticket;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const telegraf = yield* _(TelegrafTag);
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
			telegraf.sendMessage(
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
