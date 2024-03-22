import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Ticket } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

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
