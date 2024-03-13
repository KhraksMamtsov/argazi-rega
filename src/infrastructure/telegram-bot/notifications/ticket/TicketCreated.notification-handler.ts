import { Effect } from "effect";
import { Markup } from "telegraf";

import { TicketCreatedMdComponent } from "./TicketCreated.md-component.js";

import { encode } from "../../callback-query/CallbackQuery.js";
import { RestApiServiceTag } from "../../RestApiService.js";

import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";
import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

export const TicketCreatedNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly createdTicket: Ticket;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const event = yield* _(
			RestApiServiceTag.getEvent({
				params: { idEvent: args.createdTicket.idEvent },
			})
		);

		const place = yield* _(
			RestApiServiceTag.getPlaceById({
				params: { id: event.idPlace },
			})
		);

		yield* _(
			args.bot.sendMessage(
				args.user.idTelegramChat,
				yield* _(
					TicketCreatedMdComponent({
						event,
						place,
						ticket: args.createdTicket,
					})
				),
				{
					parse_mode: "MarkdownV2",
					reply_markup: Markup.inlineKeyboard([
						Markup.button.callback(
							"❌ Отменить бронь билетa",
							encode({
								action: "delete",
								id: args.createdTicket.id,
								type: "Ticket",
							})
						),
					]).reply_markup,
				}
			)
		);
	});
