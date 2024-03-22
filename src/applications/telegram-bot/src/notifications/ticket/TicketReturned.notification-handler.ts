import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Ticket } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { TicketReturnedMdComponent } from "./TicketReturned.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

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
				path: {
					idEvent: args.createdTicket.idEvent,
				},
			})
		);

		const place = yield* _(
			restApiClient.getPlaceById({
				path: {
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
