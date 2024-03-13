import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";

export const ReturnTicketCbButton = (props: { ticket: Ticket }) =>
	Effect.succeed(
		Markup.button.callback(
			"❌ Отменить бронь билетa",
			encode({
				action: "delete",
				id: props.ticket.id,
				type: "Ticket",
			})
		)
	);
