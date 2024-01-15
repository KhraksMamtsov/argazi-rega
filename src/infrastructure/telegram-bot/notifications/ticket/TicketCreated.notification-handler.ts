import { Effect, Secret } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";
import { escapeMarkdown } from "../../message/message-formater.js";
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
		const restApiClient = yield* _(RestApiServiceTag);

		const event = yield* _(
			restApiClient.getEvent({
				params: { idEvent: args.createdTicket.idEvent },
			})
		);

		const place = yield* _(
			restApiClient.getPlaceById({
				params: { id: event.idPlace },
			})
		);

		yield* _(
			args.bot.sendMessage(
				args.user.idTelegramChat,
				[
					"🎟️ Забронирован билет",
					` • Место: *${escapeMarkdown(place.name)}*`,
					` • Событие: *${escapeMarkdown(Secret.value(event.name))}*`,
					` • Время начала: *${escapeMarkdown(
						new Intl.DateTimeFormat("ru-RU", {
							dateStyle: "full",
							timeStyle: "short",
						}).format(event.dateStart)
					)}*`,
				].join("\n"),
				{
					parse_mode: "MarkdownV2",
					reply_markup: Markup.inlineKeyboard([
						Markup.button.callback(
							"❌ Вернуть билет",
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
