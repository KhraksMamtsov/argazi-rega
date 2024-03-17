import { Effect } from "effect";
import { Markup } from "telegraf";

import { TicketCreatedMdComponent } from "./TicketCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ReturnTicketCbButton } from "../../ui/button/ReturnTicket.cb-button.js";

import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";
import type { User } from "../../../../domain/user/entity/User.js";

export const TicketCreatedNotificationHandler = (args: {
	readonly createdTicket: Ticket;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const telegraf = yield* _(TelegrafTag);
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
			telegraf.sendMessage(
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
