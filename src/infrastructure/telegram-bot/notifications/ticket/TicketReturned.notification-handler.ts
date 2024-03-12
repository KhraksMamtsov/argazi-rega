import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";
import { RestApiServiceTag } from "../../RestApiService.js";
import { TicketReturnedMdComponent } from "./TicketReturned.md-component.js";

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
					id: event.idPlace,
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
				{
					parse_mode: "MarkdownV2",
					reply_markup: Markup.inlineKeyboard([
						Markup.button.callback(
							"🎟️ Забронировать билет",
							encode({
								action: "create",
								id: event.id,
								type: "Ticket",
							})
						),
					]).reply_markup,
				}
			)
		);
	});
