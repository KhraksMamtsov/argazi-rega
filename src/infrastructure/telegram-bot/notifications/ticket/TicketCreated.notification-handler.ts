import { Effect } from "effect";
import { Markup } from "telegraf";

import { TicketCreatedMdComponent } from "./TicketCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { ReturnTicketCbButton } from "../../ui/button/ReturnTicket.cb-button.js";

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
				params: { idPlace: event.idPlace },
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
				Markup.inlineKeyboard([
					yield* _(ReturnTicketCbButton({ ticket: args.createdTicket })),
				])
			)
		);
	});
